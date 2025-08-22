import { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "../../types/database.types";

/**
 * Retrieves all existing user IDs from the 'profiles' table and returns them as an object mapping.
 * @param supabase - The Supabase client.
 * @returns An object mapping usernames to user IDs.
 */
export async function getExistingUserIds(
  supabase: SupabaseClient<Database>
): Promise<Record<string, string>> {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, username");
  if (error) {
    console.error("ERROR: Failed to get existing user IDs:", error.message);
    return {};
  }
  const userIds: Record<string, string> = {};
  data.forEach((user) => (userIds[user.username] = user.id));
  return userIds;
}

/**
 * Retrieves all existing post IDs from the 'posts' table and returns them as an object mapping.
 * @param supabase - The Supabase client.
 * @returns An object mapping post titles to post IDs.
 */
export async function getExistingPostIds(
  supabase: SupabaseClient<Database>
): Promise<Record<string, number>> {
  const { data, error } = await supabase.from("posts").select("id, title");
  if (error) {
    console.error("ERROR: Failed to get existing post IDs:", error.message);
    return {};
  }
  const postIds: Record<string, number> = {};
  data.forEach((post) => (postIds[post.title] = post.id));
  return postIds;
}

/**
 * Retrieves all existing category IDs from the 'categories' table and returns them as an object mapping.
 * @param supabase - The Supabase client.
 * @returns An object mapping category names to category IDs.
 */
export async function getExistingCategoryIds(
  supabase: SupabaseClient<Database>
): Promise<Record<string, number>> {
  const { data, error } = await supabase.from("categories").select("id, name");
  if (error) {
    console.error("ERROR: Failed to get existing category IDs:", error.message);
    return {};
  }
  const categoryIds: Record<string, number> = {};
  data.forEach((category) => (categoryIds[category.name] = category.id));
  return categoryIds;
}

/**
 * Retrieves all existing tag IDs from the 'tags' table and returns them as an object mapping.
 * @param supabase - The Supabase client.
 * @returns An object mapping tag names to tag IDs.
 */
export async function getExistingTagIds(
  supabase: SupabaseClient<Database>
): Promise<Record<string, number>> {
  const { data, error } = await supabase.from("tags").select("id, name");
  if (error) {
    console.error("ERROR: Failed to get existing tag IDs:", error.message);
    return {};
  }
  const tagIds: Record<string, number> = {};
  data.forEach((tag) => (tagIds[tag.name] = tag.id));
  return tagIds;
}
