import { Hono } from "hono";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "../types/database.types";
import type { Bindings } from "../types/bindings.types";

const auth = new Hono<{ Bindings: Bindings }>();
const supabase = createClient<Database>(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

// REGISTER
auth.post("/register", async (c) => {
  try {
    const { email, password, username } = await c.req.json();

    if (!email || !password || !username) {
      return c.json(
        { error: "Email, password, and username are required" },
        400
      );
    }

    // Make User
    const { data: authData, error: authError } =
      await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      });

    if (authError) {
      return c.json({ error: authError.message }, 400);
    }

    const userId = authData.user?.id;

    if (!userId) {
      return c.json({ error: "Failed to create user" }, 500);
    }

    // Save User in profiles
    const { error: profileError } = await supabase.from("profiles").insert({
      id: userId,
      username,
    });

    if (profileError) {
      await supabase.auth.admin.deleteUser(userId);
      return c.json({ error: profileError.message }, 400);
    }

    return c.json({ message: "User registered successfully" }, 201);
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

// LOGIN
auth.post("/login", async (c) => {
  try {
    const { email, password } = await c.req.json();

    if (!email || !password) {
      return c.json({ error: "Email and password are required" }, 400);
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return c.json({ error: error.message }, 400);
    }

    // data.session present if login success
    return c.json({
      message: "Login successful",
      session: data.session,
    });
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

export default auth;
