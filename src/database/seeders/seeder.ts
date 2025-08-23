// file: seeder.ts

import { createClient } from "@supabase/supabase-js";
import type { Database } from "../../types/database.types";
import { config } from "dotenv";

import { seedUsersAndProfiles } from "./seedUsersAndProfiles";
import { seedCategories } from "./seedCategories";
import { seedTags } from "./seedTags";
import { seedPosts } from "./seedPosts";
import { seedComments } from "./seedComments";
import { seedRelationships } from "./seedRelationships";
import {
  getExistingUserIds,
  getExistingPostIds,
  getExistingCategoryIds,
  getExistingTagIds,
} from "./utils";

config();

const supabase = createClient<Database>(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

const args = process.argv.slice(2);
const target = args[0] || "all";

async function main() {
  console.log(`INFO: Starting database seeding for: ${target}`);

  switch (target) {
    case "users":
      await seedUsersAndProfiles(supabase);
      break;

    case "categories":
      await seedCategories(supabase);
      break;

    case "tags":
      await seedTags(supabase);
      break;

    case "posts": {
      const userIds = await getExistingUserIds(supabase);
      if (Object.keys(userIds).length === 0) {
        console.warn(
          "WARNING: No existing users found. Seeding new users first."
        );
        const newUsers = await seedUsersAndProfiles(supabase);
        await seedPosts(supabase, newUsers);
      } else {
        await seedPosts(supabase, userIds);
      }
      break;
    }

    case "comments": {
      const userIds = await getExistingUserIds(supabase);
      const postIds = await getExistingPostIds(supabase);

      if (
        Object.keys(userIds).length === 0 ||
        Object.keys(postIds).length === 0
      ) {
        console.error(
          "ERROR: Cannot seed comments. Missing existing users or posts."
        );
        return;
      }
      await seedComments(supabase, userIds, postIds);
      break;
    }

    case "relationships": {
      const postIds = await getExistingPostIds(supabase);
      if (Object.keys(postIds).length === 0) {
        console.error(
          "ERROR: Cannot seed relationships. No existing posts found."
        );
        return;
      }
      await seedRelationships(supabase, postIds);
      break;
    }

    case "all":
    default: {
      const userIds = await seedUsersAndProfiles(supabase);
      await seedCategories(supabase);
      await seedTags(supabase);
      const postIds = await seedPosts(supabase, userIds);
      await seedComments(supabase, userIds, postIds);
      await seedRelationships(supabase, postIds);
      break;
    }
  }

  console.log("END: Seeding completed.");
}

main().catch((err) => console.error("FATAL: The seeder script failed:", err));
