import { inject, injectable } from '@needle-di/core';

import { ApplicationController } from './application.controller';
import { ConfigService } from './common/configs/config.service';

@injectable()
export class ApplicationModule {
  constructor(
    private applicationController = inject(ApplicationController),
    private configService = inject(ConfigService)
  ) {}

  async app() {
    return this.applicationController.registerControllers();
  }

  async start() {
    const app = this.app();
    await this.onApplicationStartup();

    // register shutdown hooks
    process.on('SIGINT', this.onApplicationShutdown);
    process.on('SIGTERM', this.onApplicationShutdown);

    console.log(`Api started`);
    return app;
  }

  private onApplicationShutdown() {
    console.log('Shutting down...');
    process.exit();
  }

  private async onApplicationStartup() {
    console.log('Application startup...');
    // validate configs
    this.configService.validateEnvs();
  }
}
