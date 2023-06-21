import { config } from 'dotenv';
import express, { Request, NextFunction, Response } from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import indexRouter from './routes/index';
import { HttpCode } from './utils/httpCode';
import { AppError, NotFoundError, SuccessResponse } from './helpers/utils';
import compression from 'compression';
import './database/init.mongoDb';
import './database/init.redisDb';
config();

class App {
  public app: express.Application;

  constructor() {
    this.app = express();
    this.config();
    this.routerSetup();
    this.errorHandler();
  }

  private config() {
    this.app.use(helmet());
    this.app.use(cors({ credentials: true, origin: '*' }));
    this.app.use(compression());
    this.app.use(logger('dev'));
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));
    this.app.use(cookieParser());
    this.app.use(express.static(path.join(__dirname, 'public')));
  }

  private routerSetup() {
    this.app.use('/', indexRouter);
  }

  private errorHandler() {
    // response error
    this.app.use((_res, _req, next) => {
      const err = new NotFoundError('Not Found Url');
      next(err);
    });
    this.app.use(
      (err: AppError, _req: Request, res: Response, _next: NextFunction): void => {
        console.log('ERROR', err);
        new SuccessResponse({
          success: false,
          statusCode: err.httpCode ? err.httpCode : HttpCode.INTERNAL_SERVER_ERROR,
          errors: { message: err.message },
          message: err.isOperational ? err.errorType : 'Internal Server Error',
        }).send(res);
      },
    );
  }
}

export default new App().app;

