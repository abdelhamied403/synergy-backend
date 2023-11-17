import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';

import 'dotenv/config';
import Database from '@/database';
import router from '@/router';
import { errorHandler, notFound } from '@/middlewares/errorHandler';

const app = express();

// middlewares
app.use(morgan('dev'));
app.use(helmet());
app.use(cors());
app.use(express.json());

// mongoose connect
Database.connect();

// routes
app.get('/', (_req, res) => {
  res.json({
    message: '🦄🌈✨👋🌎🌍🌏👋✨🌈🦄',
  });
});

// api routes
app.use('/api', router);

// error routes
app.use(notFound);
app.use(errorHandler);

export default app;
