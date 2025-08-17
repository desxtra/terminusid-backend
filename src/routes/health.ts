import { Hono } from 'hono'
import { supabase } from '../lib/supabase'

export const health = new Hono()

health.get('/health', async (c) => {
  const { error } = await supabase
    .from('posts')
    .select('id', { head: true, count: 'exact' })
    .limit(1)

  if (error) {
    return c.json({ ok: false, db: 'down', error: error.message }, 500)
  }

  return c.json({ ok: true, db: 'up' })
})