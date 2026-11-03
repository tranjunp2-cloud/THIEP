import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  // Phông chữ đọc từ ổ đĩa khi vẽ ảnh xem trước — đảm bảo được đóng gói khi deploy.
  outputFileTracingIncludes: { "/thiep/[slug]/anh": ["./assets/fonts/**"] },
  partialPrefetching: true,
  // Tên miền cũ trên Vercel → tên miền chính, giữ nguyên đường dẫn + query (link thiệp đã gửi vẫn mở được).
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "invitation-card-junkio.vercel.app" }],
        destination: "https://sayido.junkiodesign.com/:path*",
        permanent: true,
      },
    ];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
