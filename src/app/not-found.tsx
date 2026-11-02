/** 404 chung — dùng inline style để không kéo CSS của trang khác vào mọi route. */
export default function NotFound() {
  return (
    <div
      style={{
        minHeight: "100svh",
        display: "grid",
        placeItems: "center",
        padding: 24,
        background: "#f7f1e7",
        color: "#1f3b2d",
        textAlign: "center",
        fontFamily: "var(--font-sans), system-ui, sans-serif",
      }}
    >
      <div>
        <p style={{ fontSize: 12, letterSpacing: "0.22em", color: "#5e7a5b", margin: 0 }}>404</p>
        <h1 style={{ fontFamily: "var(--font-display), serif", fontWeight: 500, fontSize: 40, margin: "12px 0" }}>
          Trang này không tồn tại
        </h1>
        <p style={{ color: "#5d685d", margin: "0 0 24px" }}>Có thể đường link đã bị gõ nhầm hoặc đã được đổi.</p>
        <a href="/" style={{ display: "inline-block", padding: "12px 22px", borderRadius: 999, background: "#1f3b2d", color: "#f7f1e7", textDecoration: "none" }}>
          Về trang chủ Duyên
        </a>
      </div>
    </div>
  );
}
