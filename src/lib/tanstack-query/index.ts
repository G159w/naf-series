import type { Treaty } from '@elysiajs/eden';

import { TanstackQueryModule } from './query-module';
import { VideosModule } from './video';
import { VideoClubModule } from './video-club';

class TanstackQueryHandler extends TanstackQueryModule {
  video = new VideosModule(this.opts);
  videoClub = new VideoClubModule(this.opts);
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
