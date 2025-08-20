import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "../../types/database.types";

/**
 * Seeds initial comment data.
 * @param supabase - The Supabase client instance.
 * @param userIds - A mapping of usernames to user IDs.
 * @param postIds - A mapping of post titles to post IDs.
 */
export async function seedComments(
  supabase: SupabaseClient<Database>,
  userIds: Record<string, string>,
  postIds: Record<string, number>
): Promise<void> {
  console.log("INFO: Seeding comments...");
  try {
    const { error } = await supabase.from("comments").insert([
      {
        post_id: postIds["Welcome to My Blog"],
        user_id: userIds["lyra"],
        content: "Congrats on the new blog!",
      },
      {
        post_id: postIds["Welcome to My Blog"],
        user_id: userIds["zephyr"],
        content: "Looking forward to more posts.",
      },
      {
        post_id: postIds["Getting Started with Supabase"],
        user_id: userIds["arkana"],
        content: "Nice explanation about Supabase!",
      },
      {
        post_id: postIds["Getting Started with Supabase"],
        user_id: userIds["zephyr"],
        content: "Very helpful for beginners.",
      },
    ]);
    if (error) throw error;
    console.log("SUCCESS: Comments seeded successfully.");
  } catch (err: any) {
    console.error("ERROR: Failed to seed comments:", err.message);
  }
}
