import { config } from 'dotenv'
import { z } from 'zod'
config()

const envSchema = z.object({
  DB_PASSWORD: z.string().default('Password123'),
  DB_NAME: z.string().default('Test'),
  DB_SERVER: z.string().default('localhost'),
  DB_USER: z.string().default('sa'),
})

export const _env = envSchema.safeParse(process.env)

if (!_env.success) {
  console.error(_env.error.format())
  throw new Error('Invalid environment variables')
}

export const env = _env.data
