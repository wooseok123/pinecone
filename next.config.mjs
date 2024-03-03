import path from "path";

const isProduction = false;

const __dirname = path.resolve();

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  basePath: isProduction ? "/pinecone" : undefined,
  distDir: "out",
  assetPrefix: isProduction ? "https://wooseok123.github.io/pinecone" : "",
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
  images: {
    loader: "custom",
    loaderFile: "./src/@libs/imageLoader.ts",
  },
};

export default nextConfig;
