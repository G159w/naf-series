import type { Session } from '@auth/core/types';

export const userState = $state.raw<{ session: null | Session }>({ session: null });

export const debounce = (fn: Function, delay: number) => {
  let timeout = $state<null | ReturnType<typeof setTimeout>>(null);
  return (...args: any[]) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
};
