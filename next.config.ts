import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  // Phông chữ đọc từ ổ đĩa khi vẽ ảnh xem trước — đảm bảo được đóng gói khi deploy.
  outputFileTracingIncludes: { "/thiep/[slug]/anh": ["./assets/fonts/**"] },
  partialPrefetching: true,
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
