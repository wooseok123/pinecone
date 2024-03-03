import path from "path";

// const isProduction = process.env.NODE_ENV === "production" ? true : false;

const __dirname = path.resolve();

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  // basePath: isProduction ? "/pinecone" : undefined,
  // assetPrefix: isProduction ? "https://wooseok123.github.io/pinecone" : "",
  sassOptions: {
    includePaths: [path.join(__dirname, "styles")],
  },
  output: "standalone",
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
