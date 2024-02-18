export const envConfig = {
  assetPath:
    process.env.NODE_ENV === "production"
      ? "https://wooseok123.github.io/pinecone"
      : "",
  database_url: process.env.NEXT_PUBLIC_SUPABASE_URL,
  database_key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
};
