/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: false,
  assetPrefix: process.env.NODE_ENV === "production" ? "/pinecone" : "",
  output: "export",
};

export default nextConfig;
