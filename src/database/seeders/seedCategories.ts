import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "../../types/database.types";

/**
 * Seeds initial category data.
 * @param supabase - The Supabase client instance.
 */
export async function seedCategories(
  supabase: SupabaseClient<Database>
): Promise<void> {
  console.log("INFO: Seeding categories...");
  try {
    const { error } = await supabase
      .from("categories")
      .insert([
        { name: "Technology" },
        { name: "Lifestyle" },
        { name: "Travel" },
        { name: "Food" },
      ]);
    if (error) throw error;
    console.log("SUCCESS: Categories seeded successfully.");
  } catch (err: any) {
    console.error("ERROR: Failed to seed categories:", err.message);
  }
}
