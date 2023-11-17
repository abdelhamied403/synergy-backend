import express from 'express';
import userRoutes from '@/router/routes/user.routes';

const router = express.Router();

router.get('/', (_req, res) => {
  res.json({
    message: 'API - 👋🌎🌎🌎',
  });
});

router.use('/user', userRoutes);

export default router;
