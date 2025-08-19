import { createClient } from "@supabase/supabase-js";
import type { Database } from "../types/database.types";
import { config } from "dotenv";

config();

const supabase = createClient<Database>(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

async function seed() {
  // ---------------------------------------------------
  // Seed Users (Auth + Profiles)
  // ---------------------------------------------------
  const users = [
    { email: "arkana@example.com", password: "password1", username: "arkana" },
    { email: "lyra@example.com", password: "password2", username: "lyra" },
    { email: "zephyr@example.com", password: "password3", username: "zephyr" },
  ];

  const userIds: Record<string, string> = {};

  for (const u of users) {
    const { data, error } = await supabase.auth.admin.createUser({
      email: u.email,
      password: u.password,
      email_confirm: true,
      user_metadata: { username: u.username },
    });

    if (error) {
      console.error("Error creating user:", error.message);
      continue;
    }

    const user = data.user;
    if (user) {
      userIds[u.username] = user.id;

      // Insert into profiles
      const { error: profileErr } = await supabase
        .from("profiles")
        .insert({ id: user.id, username: u.username });

      if (profileErr) {
        console.error("Error inserting profile:", profileErr.message);
      } else {
        console.log(`User ${u.username} created with id ${user.id}`);
      }
    }
  }

  // ---------------------------------------------------
  // Seed Categories
  // ---------------------------------------------------
  await supabase
    .from("categories")
    .insert([
      { name: "Technology" },
      { name: "Lifestyle" },
      { name: "Travel" },
      { name: "Food" },
    ]);

  // ---------------------------------------------------
  // Seed Tags
  // ---------------------------------------------------
  await supabase
    .from("tags")
    .insert([
      { name: "PostgreSQL" },
      { name: "Supabase" },
      { name: "JavaScript" },
      { name: "Tutorial" },
      { name: "Beginner" },
    ]);

  // ---------------------------------------------------
  // Seed Posts
  // ---------------------------------------------------
  const { data: posts } = await supabase
    .from("posts")
    .insert([
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
    ])
    .select();

  // Map post titles to IDs
  const postIds: Record<string, number> = {};
  posts?.forEach((p) => (postIds[p.title] = p.id));

  // ---------------------------------------------------
  // Seed Comments
  // ---------------------------------------------------
  await supabase.from("comments").insert([
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

  // ---------------------------------------------------
  // Seed PostCategories
  // ---------------------------------------------------
  const { data: categories } = await supabase.from("categories").select();
  const categoryIds: Record<string, number> = {};
  categories?.forEach((c) => (categoryIds[c.name] = c.id));

  await supabase.from("post_categories").insert([
    {
      post_id: postIds["Welcome to My Blog"],
      category_id: categoryIds["Technology"],
    },
    {
      post_id: postIds["Getting Started with Supabase"],
      category_id: categoryIds["Technology"],
    },
    {
      post_id: postIds["My Travel Journey"],
      category_id: categoryIds["Travel"],
    },
  ]);

  // ---------------------------------------------------
  // Seed PostTags
  // ---------------------------------------------------
  const { data: tags } = await supabase.from("tags").select();
  const tagIds: Record<string, number> = {};
  tags?.forEach((t) => (tagIds[t.name] = t.id));

  await supabase.from("post_tags").insert([
    { post_id: postIds["Welcome to My Blog"], tag_id: tagIds["Tutorial"] },
    {
      post_id: postIds["Getting Started with Supabase"],
      tag_id: tagIds["PostgreSQL"],
    },
    {
      post_id: postIds["Getting Started with Supabase"],
      tag_id: tagIds["Supabase"],
    },
    {
      post_id: postIds["Getting Started with Supabase"],
      tag_id: tagIds["Beginner"],
    },
    { post_id: postIds["My Travel Journey"], tag_id: tagIds["JavaScript"] },
  ]);

  console.log("🌱 Seeding complete!");
}

seed().catch((err) => console.error("Seeder failed:", err));
