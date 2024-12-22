import * as envs from '$env/static/private';
import { injectable } from '@needle-di/core';
import { z } from 'zod';

import { type EnvsDto, envsDto } from './dtos/env.dto';

@injectable()
export class ConfigService {
  envs: EnvsDto;

  constructor() {
    this.envs = this.parseEnvs()!;
  }

  validateEnvs() {
    try {
      return envsDto.parse(envs);
    } catch (err) {
      if (err instanceof z.ZodError) {
        const { fieldErrors } = err.flatten();
        const errorMessage = Object.entries(fieldErrors)
          .map(([field, errors]) => (errors ? `${field}: ${errors.join(', ')}` : field))
          .join('\n  ');
        throw new Error(`Missing environment variables:\n  ${errorMessage}`);
      }
    }
  }

  private parseEnvs() {
    return envsDto.parse(envs);
  }
}
