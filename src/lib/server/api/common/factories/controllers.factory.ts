import { inject } from '@needle-di/core';

import { SessionsService } from '../../sessions/sessions.service';
import { createElysia } from '../utils/elysia';

export abstract class AuthController {
  constructor(protected sessionService = inject(SessionsService)) {}
}

export abstract class Controller {
  protected readonly controller: ReturnType<typeof createElysia>;

  constructor() {
    this.controller = createElysia();
  }
}

export abstract class RootController extends Controller {
  abstract registerControllers(): ReturnType<typeof createElysia>;
}
