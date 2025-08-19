import { Hono } from "hono";
import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";
import type { Database } from "./types/database.types";
import type { Bindings } from "./types/bindings.types";
import auth from "./routes/auth";

config();
const app = new Hono<{ Bindings: Bindings }>();
const supabase = createClient<Database>(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_KEY!
);

app.get("/", async (c) => {
  const { data, error } = await supabase.from("users").select();
  return c.json(data);
});

app.route("/auth", auth);

export default app;
