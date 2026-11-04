import type { Metadata } from "next";
import "../landing.css";
import "./gallery.css";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { GalleryGrid } from "@/components/gallery/GalleryGrid";
import { Footer } from "@/components/landing/Closing";
import { Nav } from "@/components/landing/Nav";
import { contact, customDesignMailto, zaloUrl } from "@/components/landing/content";
import { ALL_TEMPLATES, FAMILIES } from "@/lib/templates/registry";

export const metadata: Metadata = {
  title: "Kho mẫu thiệp cưới — SayIDo",
  description: `${ALL_TEMPLATES.length} mẫu thiệp cưới online: truyền thống Song Hỷ, hoa màu nước, tối giản hiện đại, sang trọng ánh kim. Xem chi tiết và bản demo từng mẫu.`,
};

export default function TemplateGalleryPage() {
  return (
    <AuthProvider>
      <Nav onHome={false} />
      <main className="gl">
        <header className="gl-head container">
          <p className="eyebrow">Kho mẫu thiệp</p>
          <h1 className="h2">
            Chọn một <em>câu chuyện</em> cho ngày vui
          </h1>
          <p className="lead">
            {FAMILIES.length} dòng mẫu, {ALL_TEMPLATES.length} biến thể màu. Bấm vào từng mẫu để xem chi tiết và mở thử bản demo — đổi mẫu bất
            cứ lúc nào mà không mất nội dung đã nhập.
          </p>
        </header>
        <section className="gl-body container" aria-label="Danh sách mẫu thiệp">
          <GalleryGrid />
        </section>
        <section className="gl-contact container" aria-labelledby="gl-contact-title">
          <div className="gl-contact-card">
            <div className="gl-contact-copy">
              <p className="eyebrow eyebrow--light">Thiết kế riêng</p>
              <h2 id="gl-contact-title" className="h2">
                Chưa thấy mẫu <em>ưng ý</em>?
              </h2>
              <p className="lead">
                Kể cho chúng mình nghe câu chuyện và concept của hai bạn — màu sắc, hoạ tiết, địa điểm cưới. Nhà thiết kế sẽ vẽ riêng một mẫu
                thiệp chỉ dành cho hai bạn. Báo giá sau khi trao đổi.
              </p>
            </div>
            <div className="gl-contact-actions">
              <a href={zaloUrl} target="_blank" rel="noreferrer" className="btn btn--gold btn--lg">
                Nhắn Zalo {contact.zaloLabel}
              </a>
              <a href={customDesignMailto()} className="gl-contact-mail">
                hoặc gửi yêu cầu qua email
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer onHome={false} />
    </AuthProvider>
  );
}
