import { z } from 'zod'

export const envSchema = z.object({
  DATABASE_URL: z.url().startsWith('postgres://'),
  PORT: z.coerce.number().default(3333),
})

export type Env = z.infer<typeof envSchema>
