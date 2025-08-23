import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "../../types/database.types";
import { getExistingCategoryIds, getExistingTagIds } from "./utils";

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
    // const { data: categories, error: catErr } = await supabase
    //   .from("categories")
    //   .select("id, name");
    // if (catErr) throw catErr;
    const categoryIds: Record<string, number> = await getExistingCategoryIds(
      supabase
    );
    // categories.forEach((c) => (categoryIds[c.name] = c.id));

    // const { data: tags, error: tagErr } = await supabase
    //   .from("tags")
    //   .select("id, name");
    // if (tagErr) throw tagErr;
    const tagIds: Record<string, number> = await getExistingTagIds(supabase);
    // tags.forEach((t) => (tagIds[t.name] = t.id));

    // === Category assignments ===
    const postCategories = [
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
      {
        post_id: postIds["My Thoughts on TypeScript"],
        category_id: categoryIds["Technology"],
      },
      {
        post_id: postIds["Intro to Database Relationships"],
        category_id: categoryIds["Technology"],
      },
      {
        post_id: postIds["Remote Work Lifestyle"],
        category_id: categoryIds["Lifestyle"],
      },
      {
        post_id: postIds["Photography Tips for Beginners"],
        category_id: categoryIds["Travel"],
      },
      {
        post_id: postIds["Learning React the Fun Way"],
        category_id: categoryIds["Technology"],
      },
      {
        post_id: postIds["Deploying with Vercel"],
        category_id: categoryIds["Technology"],
      },
      {
        post_id: postIds["Understanding JavaScript Closures"],
        category_id: categoryIds["Technology"],
      },
    ];

    const { error: postCatErr } = await supabase
      .from("post_categories")
      .insert(postCategories);
    if (postCatErr) throw postCatErr;

    // === Tag assignments ===
    const postTags = [
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
      { post_id: postIds["My Travel Journey"], tag_id: tagIds["Photography"] },
      {
        post_id: postIds["My Thoughts on TypeScript"],
        tag_id: tagIds["Technology"],
      },
      {
        post_id: postIds["My Thoughts on TypeScript"],
        tag_id: tagIds["Beginner"],
      },
      {
        post_id: postIds["Intro to Database Relationships"],
        tag_id: tagIds["PostgreSQL"],
      },
      {
        post_id: postIds["Intro to Database Relationships"],
        tag_id: tagIds["SQL"],
      },
      { post_id: postIds["Remote Work Lifestyle"], tag_id: tagIds["Health"] },
      {
        post_id: postIds["Learning React the Fun Way"],
        tag_id: tagIds["Resources"],
      },
      {
        post_id: postIds["Learning React the Fun Way"],
        tag_id: tagIds["Programming"],
      },
      {
        post_id: postIds["Photography Tips for Beginners"],
        tag_id: tagIds["Photography"],
      },
      {
        post_id: postIds["Remote Work Lifestyle"],
        tag_id: tagIds["Productivity"],
      },
      { post_id: postIds["Deploying with Vercel"], tag_id: tagIds["Backend"] },
      {
        post_id: postIds["Understanding JavaScript Closures"],
        tag_id: tagIds["JavaScript"],
      },
    ];

    const { error: postTagErr } = await supabase
      .from("post_tags")
      .insert(postTags);
    if (postTagErr) throw postTagErr;

    // console.log(tagIds, categoryIds);

    console.log("SUCCESS: Post relationships seeded successfully.");
  } catch (err: any) {
    console.error("ERROR: Failed to seed post relationships:", err.message);
  }
}
