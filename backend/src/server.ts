import http from 'http';

import { Application, json, NextFunction, urlencoded, Response, Request } from 'express';
import helmet from 'helmet';
import hpp from 'hpp';
import cors from 'cors';
import compression from 'compression';
import { Logger } from 'winston';

import { todoConfig } from './config';
import { indexRoutes } from './router';
import { CustomError } from './utils/error_util';
import { winstonLogger } from './utils/logger_util';
import { UserModel } from './models/user_model';
import { TokenModel } from './models/token_model';
import { ItemsModel } from './models/item_model';

const logger: Logger = winstonLogger('SERVER_server.ts', 'debug');

const PORT_OF_SERVER = 4002;

export class Server {
  private app: Application;
  constructor(app: Application) {
    this.app = app;
  }

  public starting(): void {
    this.setupSecurity(this.app);
    this.setupRegular(this.app);
    this.setupRoutes(this.app);
    this.setupErrorHandling(this.app);
    this.start(this.app);
  }

  private setupSecurity(app: Application): void {
    app.set('trust proxy', 1);
    app.use(hpp());
    app.use(helmet());
    app.use(
      cors({
        origin: todoConfig.TODO_CLIENT_URL,
        credentials: true,
        methods: ['POST', 'DELETE', 'OPTIONS', 'PUT', 'GET']
      })
    );
  }

  private setupRegular(app: Application): void {
    // Untuk compress request agar ukuran lebih kecil
    app.use(compression());

    app.use(
      json({
        limit: '10mb'
      })
    );

    app.use(
      urlencoded({
        limit: '10mb',
        extended: true
      })
    );
  }

  private setupRoutes(app: Application): void {
    indexRoutes(app);
  }

  private setupErrorHandling(app: Application): void {
    app.use((error: CustomError, _req: Request, res: Response, next: NextFunction) => {
      logger.log('error', `Server ${error.comingFrom}:`, error);
      if (error instanceof CustomError) {
        res.status(error.statusCode).json(error.serializeErrors());
      }
      next(error);
    });
  }

  private async start(app: Application): Promise<void> {
    try {
      const httpServer: http.Server = new http.Server(app);
      this.startHttp(httpServer);
      await UserModel.sync({ alter: true });
      await ItemsModel.sync({ alter: true });
      await TokenModel.sync({ alter: true });
    } catch (error) {
      logger.log('error', 'server start() error', error);
    }
  }

  private async startHttp(httpServer: http.Server): Promise<void> {
    try {
      logger.info(`Worker with process id of ${process.pid} has started in server`);
      httpServer.listen(PORT_OF_SERVER, () => {
        logger.info(`Server was started on port ${PORT_OF_SERVER}`);
      });
    } catch (error) {
      logger.log('error', 'server startHttp() error', error);
    }
  }
}
