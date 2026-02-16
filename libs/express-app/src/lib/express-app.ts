import express, {
  Application,
  ErrorRequestHandler,
  Request,
  RequestHandler,
  Response,
  Router,
} from 'express';

export default class ExpressError extends Error {
  statusCode: number;
  details?: string | unknown;

  constructor(message: string, statusCode: number, details?: unknown) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    this.name = 'ExpressError';
    Error.captureStackTrace(this, this.constructor);
  }
}

export const createApp = (): Application => {
  const app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  return app;
};

export const addMiddleware = (app: Application, middleware: RequestHandler) => {
  app.use(middleware);
};

export const addRoutes = (app: Application, routes: Router) => {
  app.use(routes);
};

export const notFoundHandler = (req: Request, res: Response) => {
  res.status(404).json({
    error: {
      message: `Route ${req.method} ${req.originalUrl} not found`,
    },
  });
};

export const defaultErrorHandler: ErrorRequestHandler = (
  err: unknown,
  req: Request,
  res: Response,
) => {
  const statusCode = err instanceof ExpressError ? err.statusCode : 500;
  const message = err instanceof Error ? err.message : 'Internal Server Error';
  const details = err instanceof ExpressError ? err.details : null;
  console.log(statusCode, message, details);
  res.status(statusCode).json({ error: { message, details } });
};
