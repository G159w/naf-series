import { Container } from '@needle-di/core';

import { ApplicationController } from './application.controller';
import { ApplicationModule } from './application.module';

const applicationController = new Container().get(ApplicationController);
const applicationModule = new Container().get(ApplicationModule);

/* ------------------------------ startServer ------------------------------ */
export function startServer() {
  return applicationModule.start();
}

/* ----------------------------------- api ---------------------------------- */
export const apiApp = await applicationController.registerControllers();

/* ---------------------------------- Types --------------------------------- */
export type ApiRoutes = Awaited<typeof apiApp>;
