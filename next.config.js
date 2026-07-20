/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      
      { protocol: "https", hostname: "cdn.nba.com" },
      { protocol: "https", hostname: "a.espncdn.com" },
    ],
  },
};

module.exports = nextConfig;
