import express from 'express';
import User from '@/controllers/user.controller';
import { verifyToken } from '@/middlewares/jwtVerifyToken';

const router = express.Router();

// auth user
router.get('/', verifyToken, User.auth);

// login user
router.post('/login', User.login);

// register new user
router.post('/register', User.register);

// edit user
router.patch('/', verifyToken, User.update);

// remove user
router.delete('/', verifyToken, User.remove);

export default router;
