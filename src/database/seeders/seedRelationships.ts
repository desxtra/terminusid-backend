import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "../../types/database.types";

/**
 * Seeds initial post-category and post-tag relationships.
 * @param supabase - The Supabase client instance.
 * @param postIds - A mapping of post titles to post IDs.
 */
export async function seedRelationships(
  supabase: SupabaseClient<Database>,
  postIds: Record<string, number>
): Promise<void> {
  console.log("INFO: Seeding post relationships (categories & tags)...");
  try {
    // Fetch IDs for categories and tags
    const { data: categories, error: catErr } = await supabase
      .from("categories")
      .select("id, name");
    if (catErr) throw catErr;
    const categoryIds: Record<string, number> = {};
    categories.forEach((c) => (categoryIds[c.name] = c.id));

    const { data: tags, error: tagErr } = await supabase
      .from("tags")
      .select("id, name");
    if (tagErr) throw tagErr;
    const tagIds: Record<string, number> = {};
    tags.forEach((t) => (tagIds[t.name] = t.id));

    // Seed PostCategories
    const { error: postCatErr } = await supabase
      .from("post_categories")
      .insert([
        {
          post_id: postIds["Welcome to My Blog"],
          category_id: categoryIds["Technology"],
        },
        {
          post_id: postIds["Getting Started with Supabase"],
          category_id: categoryIds["Technology"],
        },
        {
          post_id: postIds["My Travel Journey"],
          category_id: categoryIds["Travel"],
        },
      ]);
    if (postCatErr) throw postCatErr;

    // Seed PostTags
    const { error: postTagErr } = await supabase.from("post_tags").insert([
      { post_id: postIds["Welcome to My Blog"], tag_id: tagIds["Tutorial"] },
      {
        post_id: postIds["Getting Started with Supabase"],
        tag_id: tagIds["PostgreSQL"],
      },
      {
        post_id: postIds["Getting Started with Supabase"],
        tag_id: tagIds["Supabase"],
      },
      {
        post_id: postIds["Getting Started with Supabase"],
        tag_id: tagIds["Beginner"],
      },
      { post_id: postIds["My Travel Journey"], tag_id: tagIds["JavaScript"] },
    ]);
    if (postTagErr) throw postTagErr;

    console.log("SUCCESS: Post relationships seeded successfully.");
  } catch (err: any) {
    console.error("ERROR: Failed to seed post relationships:", err.message);
  }
}
