import express, { Router } from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './swagger';

import campaignRouter from './routes/campaign.route';
import subscriptionRouter from './routes/subscription.route';

import {
  errorHandler,
  responseHandler,
  pageNotFoundHandler,
  initResLocalsHandler,
} from './middlewares';

const app = express();

function setUpAPIRoutes() {
  // Swagger
  app.use('/api/v1/subscriptionSwagger', swaggerUi.serveFiles(swaggerDocument), swaggerUi.setup(swaggerDocument));

  // Middlewares
  app.use(logger('dev'));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(initResLocalsHandler);

  app.use('/api/v1/subscriptions', subscriptionRouter);

  app.use('/api/v1/campaigns', campaignRouter);
}

function useCustomRoute(route: string, router: Router) {
  app.use(route, router);
}

function setUpMiddlewares() {
  // Use custom response handler
  app.use(responseHandler);

  // Use custom error handler
  app.use(errorHandler);

  // Page not found
  app.use(pageNotFoundHandler);
}

export { app, useCustomRoute, setUpAPIRoutes, setUpMiddlewares };
