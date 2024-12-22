import type { Treaty } from '@elysiajs/eden';

import { api } from '$lib/utils/api';

export abstract class TanstackQueryModule<T extends null | string = null> {
  public namespace: null | T = null;
  protected readonly api: ReturnType<typeof api>;
  protected readonly opts: Treaty.Config | undefined;

  constructor(opts?: Treaty.Config) {
    this.opts = opts;
    this.api = api(opts);
  }
}
