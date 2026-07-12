/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // NBA/ESPN/logo CDNs -- add whatever hosts your chosen sports API serves
      // headshots/logos from, e.g.:
      { protocol: "https", hostname: "cdn.nba.com" },
      { protocol: "https", hostname: "a.espncdn.com" },
    ],
  },
};

module.exports = nextConfig;
