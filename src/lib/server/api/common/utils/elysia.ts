import { type Static, type TSchema, Type } from '@sinclair/typebox';
import { Value } from '@sinclair/typebox/value';
import { Elysia } from 'elysia';

import type { SessionsService } from '../../sessions/sessions.service';

import { Unauthorized } from './exceptions';

export const authGuard = (sessionsService: SessionsService) =>
  new Elysia({
    name: 'authGuard'
  }).derive({ as: 'global' }, async function deriveBearer({ cookie }) {
    // authjs.session-token is used in development (http), __Secure-authjs.session-token in production (https)
    const token =
      cookie['authjs.session-token'].value ?? cookie['__Secure-authjs.session-token'].value;

    console.log('authGuard', cookie);
    if (!token) {
      console.log('authGuard session-token not found');
      throw Unauthorized();
    }
    const session = await sessionsService.findUserSessions(token);
    if (!session) {
      console.log('authGuard session not found');
      throw Unauthorized();
    }
    return { user: session.user };
  });

export function createAuthElysia<T extends ConstructorParameters<typeof Elysia>[0]>(
  sessionsService: SessionsService,
  options?: T
) {
  return new Elysia(options).use(authGuard(sessionsService));
}

export function createElysia(): Elysia {
  return new Elysia();
}

export const Nullable = <T extends TSchema>(schema: T) => Type.Union([Type.Null(), schema]);

export async function toDto<U extends TSchema, T extends Promise<Static<U>> | Static<U>>(
  schema: U,
  value: T
) {
  // if value is a promise, we wait for it to resolve
  if (value instanceof Promise) {
    value = await value;
  }
  const dto = Value.Cast(schema, Value.Clean(schema, Value.Clone(value)));
  return dto;
}
