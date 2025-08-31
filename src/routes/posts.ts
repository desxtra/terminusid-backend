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

//Get a post by slug
// posts.get("/:slug", async (c) => {
//   try {
//     const id = c.req.param("slug");
//     const { data, error } = await supabase
//       .from("posts")
//       .select("*")
//       .eq("id", parseInt(id!))
//       .single();
//     if (error) throw c.json({ Error: error.message }, 500);
//     return c.json(data);
//   } catch (err: any) {
//     c.json({ Error: err.message }, 500);
//   }
// });

//Get posts by username
posts.get("/by/:username", async (c) => {
  try {
    const username = c.req.param("username");
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("username", username!)
      .single();
    if (profileError) return c.json({ Error: profileError.message }, 500);

    const id = "awasdawdoij-10281";
    const { data: userData, error: userError } =
      await supabase.auth.admin.getUserById(profileData.id);
    if (userError) return c.json({ Error: userError.message }, 500);

    const { data: postData, error: postError } = await supabase
      .from("posts")
      .select("*")
      .eq("user_id", userData.user!.id);
    if (postError) return c.json({ Error: postError.message }, 500);

    return c.json([...postData]);
  } catch (err: any) {
    return c.json({ Error: err.message }, 500);
  }
});

//Get posts by category
posts.get("/category/:category", async (c) => {
  try {
    const categorySlug = c.req.param("category");
    const { data, error } = await supabase
      .from("posts")
      .select(
        `
        *,
        post_categories!inner(
          category_id,
          categories!inner(
            slug
          )
        )
      `
      )
      .eq("post_categories.categories.slug", categorySlug);
    return c.json(data);
  } catch (err: any) {
    c.json({ Error: err.message }, 500);
  }
});

export default posts;
