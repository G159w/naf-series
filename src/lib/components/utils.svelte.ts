import type { Session } from '@auth/core/types';

export const userState = $state.raw<{ session: null | Session }>({ session: null });

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeout = $state<null | ReturnType<typeof setTimeout>>(null);
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
}
