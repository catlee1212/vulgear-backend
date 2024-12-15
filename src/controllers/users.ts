import express from 'express';
import { deleteUserById, getUserById, getUsers } from '../db/users';

export const getAllUsers = async (req: express.Request, res: express.Response) => {
  try {
    const users = await getUsers();
    return res.status(200).json(users);
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

export const getUser = async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params; // Extract user ID from route params
    // Get the user by ID from the database
    const user = await getUserById(id);

    // If user is not found, return a 404 status
    if (!user) {
      return res.sendStatus(404); // Not found
    }

    let responseData = {
      authentication: user.authentication.sessionToken,
      username: user.username,
      usedProducts: user.usedProducts,
      id: user._id
    }
    // If the user exists, send the user's used products in the response
    return res.status(200).json(responseData);
  } catch (error) {
    console.error('Error fetching products:', error);
    return res.status(500).json({ message: 'Internal server error' }); // Internal server error
  }
};



export const deleteUser = async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params;
    const deletedUser = await deleteUserById(id);
    return res.status(200).json(deletedUser);
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

export const updateUser = async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params;
    const { username } = req.body;
    if (!username) {
      return res.sendStatus(400);
    }
    const user = await getUserById(id);
    user.username = username;
    await user.save();
    return res.status(200).json(user).end();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

export const getProducts = async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params; // Extract user ID from route params
    // Get the user by ID from the database
    const user = await getUserById(id);
    console.log(user);

    // If user is not found, return a 404 status
    if (!user) {
      return res.sendStatus(404); // Not found
    }

    // If the user exists, send the user's used products in the response
    return res.status(200).json(user.usedProducts);
  } catch (error) {
    console.error('Error fetching products:', error);
    return res.status(500).json({ message: 'Internal server error' }); // Internal server error
  }
};

export const updateProducts = async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params;
    const { usedProducts } = req.body;

    const user = await getUserById(id);

    if (!user) {
      return res.sendStatus(404);
    }

    user.usedProducts = usedProducts;

    await user.save();
    return res.sendStatus(200).end();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};