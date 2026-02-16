import {
  createApp,
  defaultErrorHandler,
  notFoundHandler,
} from '@rabta/express-app';

import cookieParser from 'cookie-parser';

import authRouter from './routes/auth';
import dashboardRouter from './routes/dashboard';
import defaultRouter from './routes/default';
import logoutRouter from './routes/logout';
import metadataRouter from './routes/metadata';

const PORT = process.env.PORT || 3000;
const app = createApp();

app.use(cookieParser());

app.use('/', defaultRouter);
app.use('/auth', authRouter);
app.use('/saml', metadataRouter);
app.use('/dashboard', dashboardRouter);
app.use('/logout', logoutRouter);

app.use(notFoundHandler);
app.use(defaultErrorHandler);

const startApp = async () => {
  try {
    const server = app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
    server.on('error', console.error);
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startApp();
