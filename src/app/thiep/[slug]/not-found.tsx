import "./thiep.css";
export default function NotFound() {
  return (
    <main className="thiep">
      <section className="section" style={{ minHeight: "100svh", display: "grid", placeItems: "center", textAlign: "center" }}>
        <div>
          <p className="eyebrow">404</p>
          <h2 style={{ margin: "16px 0" }}>Không tìm thấy tấm thiệp này</h2>
          <p className="script">Có thể đường link đã bị gõ nhầm. Bạn thử hỏi lại cô dâu chú rể nhé.</p>
          <p style={{ marginTop: 28 }}>
            <a href="/" className="text-link">
              Về trang chủ Duyên
            </a>
          </p>
        </div>
      </section>
    </main>
  );
}
