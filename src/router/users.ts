import express from 'express';
import { getAllUsers, getUser, deleteUser, updateUser, updateProducts, getProducts } from '../controllers/users';
import { isAuthenticated, isOwner } from '../middlewares';

export default (router: express.Router) => {
  router.get('/users', isAuthenticated, getAllUsers);
  router.get('/user/:id', isAuthenticated, isOwner, getUser);

  router.delete('/users/:id', isOwner, deleteUser);
  router.patch('/users/:id', isAuthenticated, isOwner, updateUser);

  router.get('/products/:id', isAuthenticated, isOwner, getProducts);
  router.patch('/products/:id', isAuthenticated, isOwner, updateProducts);
}
