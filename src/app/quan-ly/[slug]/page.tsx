import type { Metadata } from "next";
import { Suspense } from "react";
import { Manage } from "@/components/app/Manage";
import { SiteMusic } from "@/components/site/SiteMusic";
import { AuthProvider } from "@/components/auth/AuthProvider";
import "../../app.css";

export const metadata: Metadata = { title: "Quản lý thiệp — SayIDo", robots: { index: false } };

async function ManageLoader({ params }: PageProps<"/quan-ly/[slug]">) {
  const { slug } = await params;
  return <Manage slug={slug} />;
}

export default function ManagePage(props: PageProps<"/quan-ly/[slug]">) {
  return (
    <AuthProvider>
      <Suspense fallback={null}>
        <ManageLoader {...props} />
      </Suspense>
      <SiteMusic />
    </AuthProvider>
  );
}
