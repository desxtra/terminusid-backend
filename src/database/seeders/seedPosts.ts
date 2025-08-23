import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "../../types/database.types";
import { slugify } from "../../utils/slugify";

/**
 * Seeds initial post data.
 * @param supabase - The Supabase client instance.
 * @param userIds - A mapping of usernames to user IDs.
 * @returns An object mapping post titles to their post IDs.
 */
export async function seedPosts(
  supabase: SupabaseClient<Database>,
  userIds: Record<string, string>
): Promise<Record<string, number>> {
  console.log("INFO: Seeding posts...");
  const postData = [
    {
      user_id: userIds["arkana"],
      title: "Welcome to My Blog",
      content: "This is the first post of this blog.",
      status: "published",
    },
    {
      user_id: userIds["arkana"],
      title: "Understanding JavaScript Closures",
      content:
        "Closures are functions that have access to variables from another function’s scope.",
      status: "published",
    },
    {
      user_id: userIds["arkana"],
      title: "My Thoughts on TypeScript",
      content:
        "TypeScript adds strong typing to JavaScript, making it safer for large projects.",
      status: "draft",
    },
    {
      user_id: userIds["arkana"],
      title: "Learning React the Fun Way",
      content: "React makes building interactive UIs easy and enjoyable.",
      status: "published",
    },
    {
      user_id: userIds["lyra"],
      title: "Getting Started with Supabase",
      content: "Supabase is an open source Firebase alternative.",
      status: "published",
    },
    {
      user_id: userIds["lyra"],
      title: "Intro to Database Relationships",
      content:
        "One-to-many and many-to-many are the most common database relationships.",
      status: "published",
    },
    {
      user_id: userIds["lyra"],
      title: "Deploying with Vercel",
      content:
        "Vercel is great for hosting fullstack projects with serverless functions.",
      status: "draft",
    },
    {
      user_id: userIds["zephyr"],
      title: "My Travel Journey",
      content: "Sharing my adventure across Bali and beyond.",
      status: "draft",
    },
    {
      user_id: userIds["zephyr"],
      title: "Photography Tips for Beginners",
      content:
        "Lighting and composition are the two most important aspects of photography.",
      status: "published",
    },
    {
      user_id: userIds["zephyr"],
      title: "Remote Work Lifestyle",
      content: "Working remotely gives me freedom, but requires discipline.",
      status: "published",
    },
  ].map((post) => ({
    ...post,
    slug: slugify(post.title),
  }));

  try {
    const { data: posts, error } = await supabase
      .from("posts")
      .insert(postData)
      .select();
    if (error) throw error;

    const postIds: Record<string, number> = {};
    posts.forEach((p) => (postIds[p.title] = p.id));
    console.log(`SUCCESS: ${posts.length} posts seeded.`);
    return postIds;
  } catch (err: any) {
    console.error("ERROR: Failed to seed posts:", err.message);
    return {};
  }
}
