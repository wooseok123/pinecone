/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: false,
  output: "export",
  basePath: "/pinecone",
  assetPrefix:
    process.env.NODE_ENV === "production"
      ? "https://wooseok123.github.io/pinecone"
      : "",
};

export default nextConfig;
