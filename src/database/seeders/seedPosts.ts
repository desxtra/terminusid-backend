import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "../../types/database.types";

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
      user_id: userIds["lyra"],
      title: "Getting Started with Supabase",
      content: "Supabase is an open source Firebase alternative.",
      status: "published",
    },
    {
      user_id: userIds["zephyr"],
      title: "My Travel Journey",
      content: "Sharing my adventure across Bali and beyond.",
      status: "draft",
    },
  ];

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
