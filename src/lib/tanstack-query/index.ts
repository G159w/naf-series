import type { Treaty } from '@elysiajs/eden';

import { TanstackQueryModule } from './query-module';
import { VideoClubsModule } from './video-clubs';
import { VideosModule } from './videos';

class TanstackQueryHandler extends TanstackQueryModule {
  videoClubs = new VideoClubsModule(this.opts);
  videos = new VideosModule(this.opts);
}

export const queryHandler = (opts: { fetch: typeof fetch; fetchConfig?: Treaty.Config }) => {
  return new TanstackQueryHandler({
    ...opts?.fetchConfig,
    fetcher(url, options) {
      // ElysiaJS is adding the protocol to the URL,
      // But we don't want to use the protocol in the URL
      // cause sveltekit custom fetch already handles it
      let modifiedUrl: RequestInfo | URL = url;
      if (typeof url === 'string') {
        modifiedUrl = url.replace('https:/', '');
      } else if (url instanceof URL) {
        modifiedUrl = new URL(url.toString().replace('https:/', ''));
      }
      return opts.fetch(modifiedUrl, options);
    }
  });
};
