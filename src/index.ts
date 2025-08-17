import "dotenv/config";
import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { env } from "./env";
import { health } from "./routes/health";
import { supabase } from "./lib/supabase";
import { cors } from 'hono/cors'

const app = new Hono();

app.use('*', cors())

// Map route health check
app.route("/", health);

// Map post route
app.get("/posts", async (c) => {
  const { data, error } = await supabase
    .from("posts")
    .select("id,title,content,created_at")
    .order("created_at", { ascending: false });
  if (error) return c.json({ error: error.message }, 500);
  return c.json(data);
});

export default app;

console.log(`> API running on http://localhost:${env.PORT}`);
serve({ fetch: app.fetch, port: env.PORT });
