import type { api } from '$lib/utils/api';
import type {
  CreateMutationOptions,
  CreateQueryOptions,
  DefaultError
} from '@tanstack/svelte-query';

export type Api = ReturnType<typeof api>;

export type ApiMutation<T extends GenericFunction> = CreateMutationOptions<
  ReturnType<T>,
  DefaultError,
  ReturnType<T>,
  unknown
>;
export type ApiQuery<T extends GenericFunction> = CreateQueryOptions<ReturnType<T>>;
export type UnwrapApiReturnType<U extends GenericFunction> = Awaited<ReturnType<U>>['data'];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type GenericFunction = (...args: any[]) => any;
