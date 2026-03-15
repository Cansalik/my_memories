/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
      {
        protocol: "https",
        hostname: "*.supabase.com",
      },
    ],
  },
  // Supabase Storage'dan gelen fotoğraflar için CORS headers
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "Cross-Origin-Resource-Policy", value: "cross-origin" },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
