import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "../../types/database.types";

/**
 * Seeds initial user and profile data.
 * @param supabase - The Supabase client instance.
 * @returns An object mapping usernames to their user IDs.
 */
export async function seedUsersAndProfiles(
  supabase: SupabaseClient<Database>
): Promise<Record<string, string>> {
  console.log("INFO: Initializing user and profile seeding process...");
  const users = [
    { email: "arkana@example.com", password: "password1", username: "arkana" },
    { email: "lyra@example.com", password: "password2", username: "lyra" },
    { email: "zephyr@example.com", password: "password3", username: "zephyr" },
  ];

  const userIds: Record<string, string> = {};

  for (const u of users) {
    try {
      const { data, error } = await supabase.auth.admin.createUser({
        email: u.email,
        password: u.password,
        email_confirm: true,
        user_metadata: { username: u.username },
      });

      if (error) throw error;

      const user = data.user;
      if (user) {
        userIds[u.username] = user.id;

        // Insert into profiles
        const { error: profileErr } = await supabase
          .from("profiles")
          .insert({ id: user.id, username: u.username });

        if (profileErr) throw profileErr;
        console.log(
          `SUCCESS: User '${u.username}' created with id '${user.id}'.`
        );
      }
    } catch (err: any) {
      console.error(
        `ERROR: Failed to create user '${u.username}':`,
        err.message
      );
    }
  }

  return userIds;
}
