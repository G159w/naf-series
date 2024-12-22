import type { ApiRoutes } from '$lib/server/api';

import { treaty, type Treaty } from '@elysiajs/eden';

export const api = (options?: Treaty.Config) => treaty<ApiRoutes>('', options).api;

// Generic function to remove empty values from an object
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const removeEmpty = (obj: any) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const newObj: any = {};
  Object.keys(obj).forEach((key) => {
    if (obj[key] === Object(obj[key])) newObj[key] = removeEmpty(obj[key]);
    else if (obj[key] !== undefined) newObj[key] = obj[key];
  });
  return newObj;
};
