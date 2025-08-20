import { createClient } from "@supabase/supabase-js";
import type { Database } from "../../types/database.types";
import { config } from "dotenv";

import { seedUsersAndProfiles } from "./seedUsersAndProfiles";
import { seedCategories } from "./seedCategories";
import { seedTags } from "./seedTags";
import { seedPosts } from "./seedPosts";
import { seedComments } from "./seedComments";
import { seedRelationships } from "./seedRelationships";

config();

// Initialize Supabase client
const supabase = createClient<Database>(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

/**
 * Main function to orchestrate the entire seeding process.
 */
async function main() {
  console.log("INFO: Starting database seeding process...");

  // Execute seeding functions in a specific order to manage dependencies
  const userIds = await seedUsersAndProfiles(supabase);
  if (Object.keys(userIds).length === 0) {
    console.error("FATAL: User seeding failed. Aborting process.");
    return;
  }

  await seedCategories(supabase);
  await seedTags(supabase);

  const postIds = await seedPosts(supabase, userIds);
  if (Object.keys(postIds).length === 0) {
    console.error("FATAL: Post seeding failed. Aborting process.");
    return;
  }

  await seedComments(supabase, userIds, postIds);
  await seedRelationships(supabase, postIds);

  console.log("SUCCESS: All seeding processes completed.");
}

// Run the main function
main().catch((err) =>
  console.error("FATAL: The main seeder script failed:", err)
);
