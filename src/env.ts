import { z } from 'zod'

// Definisikan bentuk ENV yang kita butuhkan
const schema = z.object({
  SUPABASE_URL: z.string().url(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  PORT: z.coerce.number().default(8787)
})

// Parse process.env
export const env = schema.parse(process.env)