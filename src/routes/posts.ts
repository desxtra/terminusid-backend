import { Hono } from "hono";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "../types/database.types";
import type { Bindings } from "../types/bindings.types";

const posts = new Hono<{ Bindings: Bindings }>();
const supabase = createClient<Database>(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

//Get all posts datas
posts.get("/", async (c) => {
  try {
    const { data, error } = await supabase.from("posts").select("*");
    if (error) {
      return c.json({ error: error.message }, 500);
    }
    return c.json(data);
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

//Get a post by ID
posts.get("/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .eq("id", parseInt(id!))
      .single();
    if (error) throw c.json({ Error: error.message }, 500);
    return c.json(data);
  } catch (err: any) {
    c.json({ Error: err.message }, 500);
  }
});

//Get posts by user ID
posts.get("/by/:userid", async (c) => {
  try {
    const userId = c.req.param("userid");
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .eq("user_id", userId!);
    if (error) return c.json({ Error: error.message }, 500);
    return c.json(data);
  } catch (err: any) {
    return c.json({ Error: err.message }, 500);
  }
});

//Get posts by category ID
posts.get("/category/:categoryid", async (c) => {
  try {
    const categoryId = c.req.param("categoryId");
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .eq("category_id", parseInt(categoryId!));
    if (error) return c.json({ Error: error.message }, 500);
    return c.json(data);
  } catch (err: any) {
    c.json({ Error: err.message }, 500);
  }
});

export default posts;
