import { AppTop } from "./ui";

/** Khung trang văn bản (điều khoản, bảo mật). */
export function LegalPage({ title, updated, children }: { title: string; updated: string; children: React.ReactNode }) {
  return (
    <>
      <AppTop />
      <main className="manage legal">
        <p className="eyebrow">Cập nhật {updated}</p>
        <h1>{title}</h1>
        <p className="legal-note">
          Bản nháp dành cho giai đoạn thử nghiệm. Nội dung cần được rà soát pháp lý trước khi SayIDo vận hành chính thức.
        </p>
        {children}
      </main>
    </>
  );
}
