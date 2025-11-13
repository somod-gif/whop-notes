import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,

  env: {
    WHOP_API_KEY: process.env.WHOP_API_KEY,
    WHOP_CLIENT_ID: process.env.WHOP_CLIENT_ID,
    WHOP_CLIENT_SECRET: process.env.WHOP_CLIENT_SECRET,
    WHOP_REDIRECT_URI: process.env.WHOP_REDIRECT_URI,
  },
  
};

export default nextConfig;
