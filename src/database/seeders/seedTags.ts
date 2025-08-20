import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "../../types/database.types";

/**
 * Seeds initial tag data.
 * @param supabase - The Supabase client instance.
 */
export async function seedTags(
  supabase: SupabaseClient<Database>
): Promise<void> {
  console.log("INFO: Seeding tags...");
  try {
    const { error } = await supabase
      .from("tags")
      .insert([
        { name: "PostgreSQL" },
        { name: "Supabase" },
        { name: "JavaScript" },
        { name: "Tutorial" },
        { name: "Beginner" },
      ]);
    if (error) throw error;
    console.log("SUCCESS: Tags seeded successfully.");
  } catch (err: any) {
    console.error("ERROR: Failed to seed tags:", err.message);
  }
}
