import { Hono } from "hono";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "../types/database.types";
import type { Bindings } from "../types/bindings.types";

const posts = new Hono<{ Bindings: Bindings }>();
const supabase = createClient<Database>(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

posts.get("/", async (c) => {
  try {
    const { data, error } = await supabase.from("posts").select("*");
    if (error) {
      return c.json({ error: error.message }, 500);
    }
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

export default posts;
