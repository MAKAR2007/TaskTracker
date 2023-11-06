//** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [{ hostname: "images.unsplash.com" }],
    domains: ["randomuser.me", "avatars.githubusercontent.com", 'ru.freepik.com'],
  },
  experimental: {
    serverActions: true,
  },
};

module.exports = nextConfig;
