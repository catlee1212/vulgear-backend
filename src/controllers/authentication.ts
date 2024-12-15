import express from 'express';
import { createUser, createProduct, getUserByEmail } from '../db/users';
import { authentication, random } from '../helpers/index';

export const login = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.sendStatus(400);
    }

    const user = await getUserByEmail(email).select('+authentication.salt +authentication.password');

    if (!user) {
      return res.sendStatus(400);
    }

    const expectedHash = authentication(user.authentication.salt, password);

    if (user.authentication.password != expectedHash) {
      return res.sendStatus(400);
    }
    const salt = random();
    user.authentication.sessionToken = authentication(salt, user._id.toString());

    await user.save();

    res.cookie('VULGEAR-AUTH', user.authentication.sessionToken, { domain: 'localhost', path: '/' });

    let responseData = {
      authentication: user.authentication.sessionToken,
      username: user.username,
      usedProducts: user.usedProducts,
      id: user._id
    }

    return res.status(200).json(responseData).end();

  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};


export const register = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password, username } = req.body;
    if (!email || !password || !username) {
      return res.sendStatus(400);
    }
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return res.sendStatus(400);
    }
    const salt = random();

    const defaultProducts = [
      { productType: 0, isUsed: 0, amountInStock: 0 },
    ];

    const createdProducts = await Promise.all(
      defaultProducts.map((product) =>
        createProduct({
          productType: product.productType,
          isUsed: product.isUsed,
          amountInStock: product.amountInStock,
        })
      )
    );

    const user = await createUser({
      email,
      username,
      authentication: {
        salt,
        password: authentication(salt, password),
      },
      usedProducts: createdProducts,
    });
    return res.status(200).json(user).end();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

