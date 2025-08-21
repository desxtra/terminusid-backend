import { Hono } from "hono";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "../types/database.types";
import type { Bindings } from "../types/bindings.types";

const profiles = new Hono<{ Bindings: Bindings }>();
const supabase = createClient<Database>(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

profiles.get("/me", async (c) => {
  const token = c.req.header("Authorization")?.replace("Bearer", "");
  if (!token) return c.json({ error: "Unauthorized" }, 401);

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser(token);
  if (authError || !user) return c.json({ error: "Unauthorized" }, 401);

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();
  if (error) return c.json({ error: error.message }, 400);
  return c.json(profile);
});

export default profiles;
