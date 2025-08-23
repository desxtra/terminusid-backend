import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "../../types/database.types";
import { slugify } from "../../utils/slugify";

/**
 * Seeds initial tag data.
 * @param supabase - The Supabase client instance.
 */
export async function seedTags(
  supabase: SupabaseClient<Database>
): Promise<void> {
  console.log("INFO: Seeding tags...");
  try {
    const tags = [
      "PostgreSQL",
      "Supabase",
      "JavaScript",
      "Tutorial",
      "Beginner",
      "TypeScript",
      "Technology",
      "SQL",
      "Health",
      "Resources",
      "Programming",
      "Photography",
      "Productivity",
      "Backend",
    ].map((name) => ({ name, slug: slugify(name) }));

    const { error } = await supabase.from("tags").insert(tags);
    if (error) throw error;

    console.log("SUCCESS: Tags seeded successfully.");
  } catch (err: any) {
    console.error("ERROR: Failed to seed tags:", err.message);
  }
}
