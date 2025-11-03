/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: { allowedOrigins: ["*"] }
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.cloudinary.com' }
    ]
  }
};

export default nextConfig;


