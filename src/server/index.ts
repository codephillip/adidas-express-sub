import AdminBroExpress from '@admin-bro/express';
import { natsWrapper } from '@adidastest-phillip/common';
import { setUpDatabase } from 'data/index';
import { app, setUpAPIRoutes, setUpMiddlewares, useCustomRoute } from './app';
import initAdminBroRoutes from './routes/adminbro.route';

/* istanbul ignore next */
const PORT = process.env.PORT || 8000;

async function startApp() {
  await setUpDatabase();

  const adminBro = initAdminBroRoutes();
  const adminbroRouter = AdminBroExpress.buildRouter(adminBro);

  setUpAPIRoutes();

  useCustomRoute(adminBro.options.rootPath, adminbroRouter);

  setUpMiddlewares();

  await natsWrapper.connectNatsListener(
    process.env.NATS_CLUSTER_ID,
    process.env.NATS_CLIENT_ID,
    process.env.NATS_URL,
  );
  /* istanbul ignore next */
  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Express server listening on port :) ${PORT}`);
  });
}

startApp();
