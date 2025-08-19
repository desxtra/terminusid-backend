import { Hono } from "hono";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "../types/database.types";
import type { Bindings } from "../types/bindings.types";
import { encryptPassword, verifyPassword } from "../utils/password";

const auth = new Hono<{ Bindings: Bindings }>();

auth.post("/register", async (c) => {
  const { email, username, password } = await c.req.json();
  return c.json({ email, username, password });
});

export default auth;
