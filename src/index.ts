import { Hono } from "hono";
import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";
import type { Database } from "./types/database.types";
import type { Bindings } from "./types/bindings.types";
import auth from "./routes/auth";
import posts from "./routes/posts";
import profiles from "./routes/profiles";

config();
const app = new Hono<{ Bindings: Bindings }>();

app.get("/", async (c) => {
  return c.json("TerminusID backend is ready!");
});

app.route("/auth", auth);
app.route("/posts", posts);
app.route("/profiles", profiles);

export default app;
