import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  // Thiệp và trang quản lý là riêng tư — chỉ cho lập chỉ mục trang chủ.
  return { rules: { userAgent: "*", allow: "/$", disallow: ["/thiep/", "/quan-ly", "/tao-thiep", "/xem-truoc", "/api/"] } };
}
