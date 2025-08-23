import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "../../types/database.types";
import { slugify } from "../../utils/slugify";

/**
 * Seeds initial category data.
 * @param supabase - The Supabase client instance.
 */
export async function seedCategories(
  supabase: SupabaseClient<Database>
): Promise<void> {
  console.log("INFO: Seeding categories...");
  try {
    const categoriesName = ["Technology", "Lifestyle", "Travel", "Food"];
    const categories = categoriesName.map((name) => ({
      name,
      slug: slugify(name),
    }));

    const { error } = await supabase.from("categories").insert(categories);
    if (error) throw error;

    console.log("SUCCESS: Categories seeded successfully.");
  } catch (err: any) {
    console.error("ERROR: Failed to seed categories:", err.message);
  }
}
