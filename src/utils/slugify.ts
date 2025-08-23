// utils/slugify.ts
/**
 * Converts a string into a URL-friendly slug.
 * Example: "Hello World!" -> "hello-world"
 */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-") // replace non-alphanumeric with dash
    .replace(/^-+|-+$/g, ""); // trim leading/trailing dashes
}
