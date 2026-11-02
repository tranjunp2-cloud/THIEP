"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { demoInput } from "@/lib/wedding/demo";
import { EVENT_TITLES, toWedding, uniqueGuestKey, weddingInputSchema, type WeddingInput } from "@/lib/wedding/schema";
import { absolute, readMine, rememberMine, tokenFromHash } from "./mine";
import { AppTop, LinkRow } from "./ui";

/* ---------------- Dữ liệu khởi tạo ---------------- */

const blankInput = (): WeddingInput => ({
  groom: { name: "", short: "" },
  bride: { name: "", short: "" },
  city: "",
  families: [
    { father: "", mother: "", address: "" },
    { father: "", mother: "", address: "" },
  ],
  events: [
    { title: "Tiệc Cưới", subtitle: "Lễ thành hôn & tiệc mừng", date: "", start: "11:00", end: "14:00", venue: "", address: "", note: "" },
  ],
  mainIndex: 0,
  timeline: demoInput.timeline,
  dress: demoInput.dress,
  gifts: { message: demoInput.gifts.message, accounts: [] },
  faqs: [
    { q: "Có chỗ gửi xe không?", a: "Có, nhà hàng có bãi gửi xe miễn phí cho khách." },
    { q: "Mình có thể đưa bé đi cùng không?", a: "Rất hoan nghênh các bé! Bạn ghi số người đi cùng trong phần xác nhận nhé." },
  ],
  rsvpDeadline: "",
  guests: [],
});

const STEPS = ["Cô dâu & chú rể", "Gia đình", "Lễ cưới", "Lịch trình", "Mừng cưới", "Khách mời", "Xuất bản"] as const;
const STEP_OF: Record<string, number> = { groom: 0, bride: 0, city: 0, families: 1, events: 2, mainIndex: 2, rsvpDeadline: 2, timeline: 3, dress: 3, gifts: 4, faqs: 4, guests: 5 };

const DATE = /^\d{4}-\d{2}-\d{2}$/;
const TIME = /^([01]\d|2[0-3]):[0-5]\d$/;

/** Bản xem trước luôn hiển thị được: chỗ trống được thay bằng chữ gợi ý. */
function previewWedding(input: WeddingInput) {
  const d = structuredClone(input);
  d.groom.short ||= "Chú rể";
  d.groom.name ||= d.groom.short;
  d.bride.short ||= "Cô dâu";
  d.bride.name ||= d.bride.short;
  d.city ||= "Thành phố";
  d.events = d.events.map((e) => ({
    ...e,
    title: (EVENT_TITLES as readonly string[]).includes(e.title) ? e.title : "Tiệc Cưới",
    date: DATE.test(e.date) ? e.date : "2026-12-20",
    start: TIME.test(e.start) ? e.start : "11:00",
    end: TIME.test(e.end) ? e.end : "14:00",
    venue: e.venue || "Tên nhà hàng / địa điểm",
    address: e.address || "Địa chỉ tổ chức",
  }));
  d.timeline = d.timeline.map((t) => ({ ...t, time: TIME.test(t.time) ? t.time : "00:00" }));
  if (!DATE.test(d.rsvpDeadline)) d.rsvpDeadline = "";
  return toWedding("xem-truoc", d);
}

const LABELS: Record<string, string> = {
  "groom.name": "Họ tên đầy đủ của chú rể",
  "groom.short": "Tên gọi của chú rể",
  "bride.name": "Họ tên đầy đủ của cô dâu",
  "bride.short": "Tên gọi của cô dâu",
  city: "Thành phố",
  rsvpDeadline: "Hạn xác nhận tham dự",
};

function issueLabel(path: PropertyKey[]) {
  const key = path.join(".");
  if (LABELS[key]) return LABELS[key];
  const [root, i, field] = path as [string, number, string];
  const names: Record<string, string> = { date: "ngày", start: "giờ bắt đầu", end: "giờ kết thúc", venue: "địa điểm", address: "địa chỉ", time: "giờ", title: "tiêu đề", q: "câu hỏi", a: "câu trả lời", bank: "ngân hàng", number: "số tài khoản", holder: "chủ tài khoản", name: "tên" };
  const what = names[field] ?? field;
  if (root === "events") return `Sự kiện ${Number(i) + 1}: ${what}`;
  if (root === "timeline") return `Lịch trình mục ${Number(i) + 1}: ${what}`;
  if (root === "faqs") return `Hỏi đáp ${Number(i) + 1}: ${what}`;
  if (root === "guests") return `Khách mời ${Number(i) + 1}: ${what}`;
  if (root === "gifts") return `Tài khoản mừng cưới: ${names[String(path[3])] ?? ""}`;
  return key;
}

/* ---------------- Ô nhập ---------------- */

type FieldProps = { label: string; invalid?: boolean; hint?: string; className?: string; children: React.ReactNode };

function Field({ label, invalid, hint, className = "", children }: FieldProps) {
  return (
    <label className={`field ${invalid ? "is-invalid" : ""} ${className}`}>
      <span>{label}</span>
      {children}
      {hint && <small>{hint}</small>}
    </label>
  );
}

export function Builder() {
  const [input, setInput] = useState<WeddingInput>(demoInput);
  const [isSample, setIsSample] = useState(true);
  const [step, setStep] = useState(0);
  const [mode, setMode] = useState<"new" | "edit">("new");
  const [edit, setEdit] = useState<{ slug: string; token: string } | null>(null);
  const [loadError, setLoadError] = useState("");
  const [available, setAvailable] = useState<boolean | null>(null);
  const [showErrors, setShowErrors] = useState(false);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [serverError, setServerError] = useState("");
  const [published, setPublished] = useState<{ slug: string; token: string } | null>(null);
  const [previewGuest, setPreviewGuest] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [sheet, setSheet] = useState(false);
  const [newGuest, setNewGuest] = useState({ name: "", tone: "peer" as "peer" | "elder", side: "Nhà trai" as "Nhà trai" | "Nhà gái" });
  const [bulk, setBulk] = useState("");
  const frames = useRef<Set<HTMLIFrameElement>>(new Set());
  const loaded = useRef(false);

  const set = useCallback((fn: (d: WeddingInput) => void) => {
    setInput((prev) => {
      const d = structuredClone(prev);
      fn(d);
      return d;
    });
  }, []);

  /* --- Khởi tạo: chế độ sửa (?sua=slug#t=token) hoặc bản nháp --- */
  useEffect(() => {
    const slug = new URLSearchParams(window.location.search).get("sua");
    fetch("/api/weddings", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => setAvailable(d?.available === true))
      .catch(() => setAvailable(false));

    if (slug) {
      const token = tokenFromHash() || readMine().find((m) => m.slug === slug)?.token || "";
      fetch(`/api/weddings/${encodeURIComponent(slug)}`, { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" })
        .then(async (r) => {
          const d = await r.json();
          if (!r.ok) throw new Error(d?.error ?? "Không mở được thiệp.");
          setInput(d.input);
          setIsSample(false);
          setMode("edit");
          setEdit({ slug, token });
          history.replaceState(null, "", `/tao-thiep?sua=${slug}`); // bỏ token khỏi thanh địa chỉ
        })
        .catch((e) => setLoadError(e.message))
        .finally(() => (loaded.current = true));
      return;
    }
    try {
      const draft = JSON.parse(localStorage.getItem("duyen:draft") ?? "null");
      // Bản nháp có thể còn ô trống nên chỉ kiểm tra hình dạng, không kiểm tra nội dung.
      const d = draft?.input;
      const ok =
        d && typeof d.groom === "object" && typeof d.bride === "object" && Array.isArray(d.families) && d.families.length === 2 &&
        Array.isArray(d.events) && d.events.length > 0 && Array.isArray(d.timeline) && Array.isArray(d.faqs) && Array.isArray(d.guests) &&
        typeof d.gifts === "object" && Array.isArray(d.gifts.accounts) && typeof d.dress === "object";
      if (ok) {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- khôi phục nháp từ localStorage (chỉ có ở trình duyệt)
        setInput(draft.input);
        setIsSample(Boolean(draft.sample));
      }
    } catch {}
    loaded.current = true;
  }, []);

  /* --- Tự lưu nháp (chỉ khi tạo mới) --- */
  useEffect(() => {
    if (!loaded.current || mode !== "new" || published) return;
    const id = setTimeout(() => {
      try {
        localStorage.setItem("duyen:draft", JSON.stringify({ input, sample: isSample }));
      } catch {}
    }, 400);
    return () => clearTimeout(id);
  }, [input, isSample, mode, published]);

  /* --- Gửi dữ liệu sang khung xem trước --- */
  const previewData = useMemo(() => previewWedding(input), [input]);
  const post = useCallback(() => {
    const msg = { type: "duyen:preview", wedding: previewData, guestKey: previewGuest, open: previewOpen };
    frames.current.forEach((f) => f.contentWindow?.postMessage(msg, window.location.origin));
  }, [previewData, previewGuest, previewOpen]);

  useEffect(() => {
    const id = setTimeout(post, 120);
    return () => clearTimeout(id);
  }, [post]);

  useEffect(() => {
    const onReady = (e: MessageEvent) => {
      if (e.origin === window.location.origin && e.data?.type === "duyen:preview-ready") post();
    };
    window.addEventListener("message", onReady);
    return () => window.removeEventListener("message", onReady);
  }, [post]);

  const frameRef = useCallback((el: HTMLIFrameElement | null) => {
    if (el) frames.current.add(el);
    else frames.current.forEach((f) => !f.isConnected && frames.current.delete(f));
  }, []);

  /* --- Kiểm tra --- */
  const validation = useMemo(() => weddingInputSchema.safeParse(input), [input]);
  const issues = validation.success ? [] : validation.error.issues;
  const errorPaths = new Set(issues.map((i) => i.path.join(".")));
  const stepErrors = new Set(issues.map((i) => STEP_OF[String(i.path[0])] ?? 6));

  const bad = (path: string) => showErrors && errorPaths.has(path);

  /* --- Khách mời --- */
  function addGuests(names: string[]) {
    set((d) => {
      const taken = new Set(d.guests.map((g) => g.key));
      for (const raw of names) {
        const name = raw.trim().slice(0, 80);
        if (!name) continue;
        const key = uniqueGuestKey(name, taken);
        taken.add(key);
        d.guests.push({ key, name, tone: newGuest.tone, side: newGuest.side });
      }
    });
  }

  /* --- Xuất bản / lưu --- */
  async function submit() {
    setShowErrors(true);
    setServerError("");
    setNotice("");
    if (!validation.success) return;
    setBusy(true);
    try {
      if (mode === "edit" && edit) {
        const r = await fetch(`/api/weddings/${edit.slug}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${edit.token}` },
          body: JSON.stringify(validation.data),
        });
        const d = await r.json().catch(() => ({}));
        if (!r.ok) throw new Error(d?.error ?? "Chưa lưu được thay đổi.");
        rememberMine({ slug: edit.slug, token: edit.token, title: `${input.groom.short} & ${input.bride.short}`, savedAt: new Date().toISOString() });
        setNotice("Đã lưu! Khách mở lại đường link sẽ thấy nội dung mới.");
      } else {
        const r = await fetch("/api/weddings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(validation.data),
        });
        const d = await r.json().catch(() => ({}));
        if (!r.ok) throw new Error(d?.error ?? "Chưa xuất bản được thiệp.");
        rememberMine({ slug: d.slug, token: d.token, title: `${input.groom.short} & ${input.bride.short}`, savedAt: new Date().toISOString() });
        try {
          localStorage.removeItem("duyen:draft");
        } catch {}
        setPublished({ slug: d.slug, token: d.token });
        window.scrollTo({ top: 0 });
      }
    } catch (e) {
      setServerError(e instanceof Error ? e.message : "Có lỗi xảy ra.");
    } finally {
      setBusy(false);
    }
  }

  /* ---------------- Giao diện ---------------- */

  if (loadError) {
    return (
      <>
        <AppTop />
        <div className="center-page">
          <div className="panel">
            <h1>Không mở được thiệp</h1>
            <p className="panel-lead">{loadError} Hãy dùng đúng link quản lý bạn nhận được khi xuất bản.</p>
            <a className="btn btn-dark" href="/quan-ly">
              Thiệp của tôi
            </a>
          </div>
        </div>
      </>
    );
  }

  if (published) {
    const base = `/thiep/${published.slug}`;
    const manage = absolute(`/quan-ly/${published.slug}#t=${published.token}`);
    return (
      <>
        <AppTop />
        <div className="center-page">
          <div className="panel" style={{ maxWidth: 680 }}>
            <p className="eyebrow">Xuất bản thành công</p>
            <h1>Thiệp của {input.groom.short} &amp; {input.bride.short} đã sẵn sàng 💌</h1>
            <p className="panel-lead">Gửi link chung, hoặc gửi link riêng mang tên từng vị khách ở trang quản lý.</p>
            <b>Link thiệp chung</b>
            <LinkRow url={absolute(base)} />
            <div className="secret">
              <b>Link quản lý — chỉ dành cho hai bạn</b>
              <p style={{ margin: "6px 0 0", fontSize: 14 }}>
                Dùng để sửa thiệp và xem ai đã xác nhận. Ai có link này đều sửa được thiệp, đừng gửi cho khách. Hãy lưu lại (gửi
                vào Zalo “My Documents” chẳng hạn) — link cũng được nhớ trên trình duyệt này.
              </p>
              <LinkRow url={manage} label="Chép link quản lý" />
            </div>
            <div className="step-nav">
              <a className="btn btn-ghost" href={base} target="_blank" rel="noreferrer">
                Xem thiệp
              </a>
              <a className="btn btn-dark" href={`/quan-ly/${published.slug}#t=${published.token}`}>
                Mở trang quản lý →
              </a>
            </div>
          </div>
        </div>
      </>
    );
  }

  const guestOptions = input.guests.map((g) => (
    <option key={g.key} value={g.key}>
      Khách: {g.name}
    </option>
  ));

  const previewTools = (
    <div className="preview-tools">
      <select value={previewGuest} onChange={(e) => setPreviewGuest(e.target.value)} aria-label="Xem trước với khách">
        <option value="">Link chung (Quý khách)</option>
        {guestOptions}
      </select>
      <button type="button" className="btn btn-ghost btn-sm" onClick={() => setPreviewOpen((v) => !v)}>
        {previewOpen ? "Xem bìa thiệp" : "Mở thiệp"}
      </button>
    </div>
  );

  return (
    <>
      <AppTop>
        <span className="app-title">{mode === "edit" ? "Sửa thiệp" : "Tạo thiệp mới"}</span>
        <a className="btn btn-ghost btn-sm" href="/quan-ly">
          Thiệp của tôi
        </a>
      </AppTop>

      <div className="builder">
        <div>
          <nav className="steps" aria-label="Các bước">
            {STEPS.map((s, i) => (
              <button
                key={s}
                type="button"
                className={`step-pill ${step === i ? "is-active" : ""} ${showErrors && stepErrors.has(i) ? "has-error" : ""}`}
                onClick={() => setStep(i)}
                aria-current={step === i ? "step" : undefined}
              >
                <span>{i + 1}</span>
                {s}
              </button>
            ))}
          </nav>

          <div className="panel">
            {isSample && mode === "new" && (
              <div className="sample-banner">
                <span>Đang hiển thị dữ liệu mẫu để bạn hình dung — hãy thay bằng thông tin của hai bạn.</span>
                <button
                  type="button"
                  className="btn btn-sm btn-ghost"
                  onClick={() => {
                    setInput(blankInput());
                    setIsSample(false);
                    setStep(0);
                  }}
                >
                  Bắt đầu từ trang trắng
                </button>
              </div>
            )}

            {step === 0 && (
              <>
                <h1>Cô dâu &amp; chú rể</h1>
                <p className="panel-lead">Tên gọi ngắn dùng trên bìa thiệp; họ tên đầy đủ dùng ở phần báo hỷ.</p>
                <div className="grid-2">
                  <Field label="Họ tên đầy đủ chú rể" invalid={bad("groom.name")}>
                    <input value={input.groom.name} onChange={(e) => set((d) => void (d.groom.name = e.target.value))} placeholder="Nguyễn Minh Quân" />
                  </Field>
                  <Field label="Tên gọi chú rể" invalid={bad("groom.short")}>
                    <input value={input.groom.short} onChange={(e) => set((d) => void (d.groom.short = e.target.value))} placeholder="Minh Quân" />
                  </Field>
                  <Field label="Họ tên đầy đủ cô dâu" invalid={bad("bride.name")}>
                    <input value={input.bride.name} onChange={(e) => set((d) => void (d.bride.name = e.target.value))} placeholder="Lê Thanh Mai" />
                  </Field>
                  <Field label="Tên gọi cô dâu" invalid={bad("bride.short")}>
                    <input value={input.bride.short} onChange={(e) => set((d) => void (d.bride.short = e.target.value))} placeholder="Thanh Mai" />
                  </Field>
                  <Field label="Thành phố tổ chức" invalid={bad("city")}>
                    <input value={input.city} onChange={(e) => set((d) => void (d.city = e.target.value))} placeholder="Hà Nội" />
                  </Field>
                </div>
              </>
            )}

            {step === 1 && (
              <>
                <h1>Gia đình hai bên</h1>
                <p className="panel-lead">Hiển thị trong phần “Cùng gia đình hai bên trân trọng báo tin”. Có thể để trống.</p>
                {(["Nhà trai", "Nhà gái"] as const).map((side, i) => (
                  <div className="sub-card" key={side}>
                    <div className="sub-card-head">
                      <b>{side}</b>
                    </div>
                    <div className="grid-3">
                      <Field label="Bố" invalid={bad(`families.${i}.father`)}>
                        <input value={input.families[i].father} onChange={(e) => set((d) => void (d.families[i].father = e.target.value))} placeholder="Ông …" />
                      </Field>
                      <Field label="Mẹ" invalid={bad(`families.${i}.mother`)}>
                        <input value={input.families[i].mother} onChange={(e) => set((d) => void (d.families[i].mother = e.target.value))} placeholder="Bà …" />
                      </Field>
                      <Field label="Địa chỉ" invalid={bad(`families.${i}.address`)}>
                        <input value={input.families[i].address} onChange={(e) => set((d) => void (d.families[i].address = e.target.value))} placeholder="Quận, Thành phố" />
                      </Field>
                    </div>
                  </div>
                ))}
              </>
            )}

            {step === 2 && (
              <>
                <h1>Lễ cưới</h1>
                <p className="panel-lead">Tối đa 3 sự kiện. Ngày âm lịch được tính tự động. Sự kiện chính dùng cho bìa thiệp và đồng hồ đếm ngược.</p>
                {input.events.map((ev, i) => (
                  <div className="sub-card" key={i}>
                    <div className="sub-card-head">
                      <b>Sự kiện {i + 1}</b>
                      <div className="radio-row">
                        <label className="chip">
                          <input type="radio" name="main" checked={input.mainIndex === i} onChange={() => set((d) => void (d.mainIndex = i))} />
                          Sự kiện chính
                        </label>
                        {input.events.length > 1 && (
                          <button
                            type="button"
                            className="btn-link btn-danger"
                            onClick={() =>
                              set((d) => {
                                d.events.splice(i, 1);
                                if (d.mainIndex >= d.events.length) d.mainIndex = d.events.length - 1;
                              })
                            }
                          >
                            Xoá
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="grid-2">
                      <Field label="Loại lễ" invalid={bad(`events.${i}.title`)}>
                        <select value={ev.title} onChange={(e) => set((d) => void (d.events[i].title = e.target.value as (typeof EVENT_TITLES)[number]))}>
                          {EVENT_TITLES.map((t) => (
                            <option key={t}>{t}</option>
                          ))}
                        </select>
                      </Field>
                      <Field label="Dòng phụ" invalid={bad(`events.${i}.subtitle`)}>
                        <input value={ev.subtitle} onChange={(e) => set((d) => void (d.events[i].subtitle = e.target.value))} placeholder="Tại tư gia nhà gái" />
                      </Field>
                    </div>
                    <div className="grid-3" style={{ marginTop: 14 }}>
                      <Field label="Ngày (dương lịch)" invalid={bad(`events.${i}.date`)}>
                        <input type="date" value={ev.date} onChange={(e) => set((d) => void (d.events[i].date = e.target.value))} />
                      </Field>
                      <Field label="Bắt đầu" invalid={bad(`events.${i}.start`)}>
                        <input type="time" value={ev.start} onChange={(e) => set((d) => void (d.events[i].start = e.target.value))} />
                      </Field>
                      <Field label="Kết thúc" invalid={bad(`events.${i}.end`)}>
                        <input type="time" value={ev.end} onChange={(e) => set((d) => void (d.events[i].end = e.target.value))} />
                      </Field>
                    </div>
                    <div className="grid-2" style={{ marginTop: 14 }}>
                      <Field label="Địa điểm" invalid={bad(`events.${i}.venue`)}>
                        <input value={ev.venue} onChange={(e) => set((d) => void (d.events[i].venue = e.target.value))} placeholder="Nhà hàng …" />
                      </Field>
                      <Field label="Địa chỉ" invalid={bad(`events.${i}.address`)} hint="Dùng cho nút chỉ đường Google Maps">
                        <input value={ev.address} onChange={(e) => set((d) => void (d.events[i].address = e.target.value))} placeholder="Số nhà, đường, quận, thành phố" />
                      </Field>
                      <Field label="Ghi chú (không bắt buộc)" invalid={bad(`events.${i}.note`)} className="span-2">
                        <input value={ev.note} onChange={(e) => set((d) => void (d.events[i].note = e.target.value))} />
                      </Field>
                    </div>
                  </div>
                ))}
                {input.events.length < 3 && (
                  <button
                    type="button"
                    className="btn btn-ghost section-gap"
                    onClick={() =>
                      set((d) =>
                        void d.events.push({ title: "Lễ Vu Quy", subtitle: "Tại tư gia nhà gái", date: d.events[0]?.date ?? "", start: "08:00", end: "09:30", venue: "Tư gia nhà gái", address: "", note: "" }),
                      )
                    }
                  >
                    + Thêm sự kiện
                  </button>
                )}
                <div className="grid-2 section-gap">
                  <Field label="Hạn xác nhận tham dự" invalid={bad("rsvpDeadline")}>
                    <input type="date" value={input.rsvpDeadline} onChange={(e) => set((d) => void (d.rsvpDeadline = e.target.value))} />
                  </Field>
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <h1>Lịch trình &amp; trang phục</h1>
                <p className="panel-lead">Tối đa 6 mốc. Mỗi mốc có một hình minh hoạ màu nước riêng.</p>
                {input.timeline.map((t, i) => (
                  <div className="sub-card" key={i}>
                    <div className="sub-card-head">
                      <b>Mốc {i + 1}</b>
                      <button type="button" className="btn-link btn-danger" onClick={() => set((d) => void d.timeline.splice(i, 1))}>
                        Xoá
                      </button>
                    </div>
                    <div className="grid-3">
                      <Field label="Giờ" invalid={bad(`timeline.${i}.time`)}>
                        <input type="time" value={t.time} onChange={(e) => set((d) => void (d.timeline[i].time = e.target.value))} />
                      </Field>
                      <Field label="Tiêu đề" invalid={bad(`timeline.${i}.title`)}>
                        <input value={t.title} onChange={(e) => set((d) => void (d.timeline[i].title = e.target.value))} />
                      </Field>
                      <Field label="Mô tả" invalid={bad(`timeline.${i}.detail`)}>
                        <input value={t.detail} onChange={(e) => set((d) => void (d.timeline[i].detail = e.target.value))} />
                      </Field>
                    </div>
                  </div>
                ))}
                {input.timeline.length < 6 && (
                  <button type="button" className="btn btn-ghost section-gap" onClick={() => set((d) => void d.timeline.push({ time: "12:00", title: "", detail: "" }))}>
                    + Thêm mốc
                  </button>
                )}
                <div className="grid-2 section-gap">
                  <Field label="Phong cách trang phục" invalid={bad("dress.title")}>
                    <input value={input.dress.title} onChange={(e) => set((d) => void (d.dress.title = e.target.value))} placeholder="Thanh lịch" />
                  </Field>
                  <Field label="Lời nhắn về trang phục" invalid={bad("dress.note")} className="span-2">
                    <textarea value={input.dress.note} onChange={(e) => set((d) => void (d.dress.note = e.target.value))} />
                  </Field>
                </div>
              </>
            )}

            {step === 4 && (
              <>
                <h1>Mừng cưới &amp; hỏi đáp</h1>
                <p className="panel-lead">Thông tin tài khoản hiển thị kèm nút chép số. Duyên không giữ hay xử lý tiền mừng.</p>
                <Field label="Lời nhắn" invalid={bad("gifts.message")}>
                  <textarea value={input.gifts.message} onChange={(e) => set((d) => void (d.gifts.message = e.target.value))} />
                </Field>
                {input.gifts.accounts.map((a, i) => (
                  <div className="sub-card" key={i}>
                    <div className="sub-card-head">
                      <b>Tài khoản {i + 1}</b>
                      <button type="button" className="btn-link btn-danger" onClick={() => set((d) => void d.gifts.accounts.splice(i, 1))}>
                        Xoá
                      </button>
                    </div>
                    <div className="grid-2">
                      <Field label="Bên" invalid={bad(`gifts.accounts.${i}.side`)}>
                        <select value={a.side} onChange={(e) => set((d) => void (d.gifts.accounts[i].side = e.target.value as "Nhà trai" | "Nhà gái"))}>
                          <option>Nhà trai</option>
                          <option>Nhà gái</option>
                        </select>
                      </Field>
                      <Field label="Ngân hàng" invalid={bad(`gifts.accounts.${i}.bank`)}>
                        <input value={a.bank} onChange={(e) => set((d) => void (d.gifts.accounts[i].bank = e.target.value))} />
                      </Field>
                      <Field label="Số tài khoản" invalid={bad(`gifts.accounts.${i}.number`)}>
                        <input inputMode="numeric" value={a.number} onChange={(e) => set((d) => void (d.gifts.accounts[i].number = e.target.value))} />
                      </Field>
                      <Field label="Chủ tài khoản" invalid={bad(`gifts.accounts.${i}.holder`)}>
                        <input value={a.holder} onChange={(e) => set((d) => void (d.gifts.accounts[i].holder = e.target.value.toUpperCase()))} />
                      </Field>
                    </div>
                  </div>
                ))}
                {input.gifts.accounts.length < 2 && (
                  <button
                    type="button"
                    className="btn btn-ghost section-gap"
                    onClick={() =>
                      set((d) => void d.gifts.accounts.push({ side: d.gifts.accounts[0]?.side === "Nhà trai" ? "Nhà gái" : "Nhà trai", bank: "", number: "", holder: "" }))
                    }
                  >
                    + Thêm tài khoản
                  </button>
                )}

                <h2 className="section-gap">Hỏi đáp</h2>
                {input.faqs.map((f, i) => (
                  <div className="sub-card" key={i}>
                    <div className="sub-card-head">
                      <b>Câu {i + 1}</b>
                      <button type="button" className="btn-link btn-danger" onClick={() => set((d) => void d.faqs.splice(i, 1))}>
                        Xoá
                      </button>
                    </div>
                    <div className="grid-2">
                      <Field label="Câu hỏi" invalid={bad(`faqs.${i}.q`)} className="span-2">
                        <input value={f.q} onChange={(e) => set((d) => void (d.faqs[i].q = e.target.value))} />
                      </Field>
                      <Field label="Trả lời" invalid={bad(`faqs.${i}.a`)} className="span-2">
                        <textarea value={f.a} onChange={(e) => set((d) => void (d.faqs[i].a = e.target.value))} />
                      </Field>
                    </div>
                  </div>
                ))}
                {input.faqs.length < 8 && (
                  <button type="button" className="btn btn-ghost section-gap" onClick={() => set((d) => void d.faqs.push({ q: "", a: "" }))}>
                    + Thêm câu hỏi
                  </button>
                )}
              </>
            )}

            {step === 5 && (
              <>
                <h1>Khách mời</h1>
                <p className="panel-lead">
                  Mỗi khách có một đường link riêng mang tên họ. Với người lớn, thiệp tự xưng “chúng con”; với bạn bè là “chúng mình”.
                </p>
                <div className="guest-add">
                  <label className="field">
                    <span>Tên trên thiệp</span>
                    <input
                      value={newGuest.name}
                      onChange={(e) => setNewGuest({ ...newGuest, name: e.target.value })}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addGuests([newGuest.name]);
                          setNewGuest({ ...newGuest, name: "" });
                        }
                      }}
                      placeholder="Cô Lan & Chú Hùng"
                    />
                  </label>
                  <label className="field">
                    <span>Xưng hô</span>
                    <select value={newGuest.tone} onChange={(e) => setNewGuest({ ...newGuest, tone: e.target.value as "peer" | "elder" })}>
                      <option value="peer">Bạn bè, anh chị em</option>
                      <option value="elder">Người lớn (cô, chú, bác…)</option>
                    </select>
                  </label>
                  <label className="field">
                    <span>Khách của</span>
                    <select value={newGuest.side} onChange={(e) => setNewGuest({ ...newGuest, side: e.target.value as "Nhà trai" | "Nhà gái" })}>
                      <option>Nhà trai</option>
                      <option>Nhà gái</option>
                    </select>
                  </label>
                  <button
                    type="button"
                    className="btn btn-dark"
                    disabled={!newGuest.name.trim()}
                    onClick={() => {
                      addGuests([newGuest.name]);
                      setNewGuest({ ...newGuest, name: "" });
                    }}
                  >
                    Thêm
                  </button>
                </div>

                <details className="sub-card">
                  <summary style={{ cursor: "pointer", fontWeight: 500 }}>Thêm nhiều khách một lúc (mỗi dòng một tên)</summary>
                  <label className="field" style={{ marginTop: 12 }}>
                    <span>Danh sách — dùng xưng hô và bên đang chọn ở trên</span>
                    <textarea value={bulk} onChange={(e) => setBulk(e.target.value)} rows={5} placeholder={"Anh Tuấn\nChị Ngọc Hân\nBạn Thảo Vy"} />
                  </label>
                  <button
                    type="button"
                    className="btn btn-ghost section-gap"
                    disabled={!bulk.trim()}
                    onClick={() => {
                      addGuests(bulk.split("\n"));
                      setBulk("");
                    }}
                  >
                    Thêm {bulk.split("\n").filter((l) => l.trim()).length || ""} khách
                  </button>
                </details>

                {input.guests.length === 0 ? (
                  <p className="empty">Chưa có khách nào. Bạn vẫn có thể xuất bản và gửi link chung.</p>
                ) : (
                  <table className="guest-table">
                    <thead>
                      <tr>
                        <th>Tên ({input.guests.length})</th>
                        <th>Xưng hô</th>
                        <th>Bên</th>
                        <th />
                      </tr>
                    </thead>
                    <tbody>
                      {input.guests.map((g, i) => (
                        <tr key={g.key}>
                          <td>
                            <input aria-label="Tên khách" value={g.name} onChange={(e) => set((d) => void (d.guests[i].name = e.target.value))} />
                          </td>
                          <td>
                            <select aria-label="Xưng hô" value={g.tone} onChange={(e) => set((d) => void (d.guests[i].tone = e.target.value as "peer" | "elder"))}>
                              <option value="peer">Bạn bè</option>
                              <option value="elder">Người lớn</option>
                            </select>
                          </td>
                          <td>
                            <select aria-label="Bên" value={g.side} onChange={(e) => set((d) => void (d.guests[i].side = e.target.value as "Nhà trai" | "Nhà gái"))}>
                              <option>Nhà trai</option>
                              <option>Nhà gái</option>
                            </select>
                          </td>
                          <td style={{ textAlign: "right" }}>
                            <button type="button" className="btn-link btn-danger" onClick={() => set((d) => void d.guests.splice(i, 1))}>
                              Xoá
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </>
            )}

            {step === 6 && (
              <>
                <h1>{mode === "edit" ? "Lưu thay đổi" : "Xuất bản thiệp"}</h1>
                <p className="panel-lead">
                  {mode === "edit"
                    ? "Thay đổi áp dụng ngay trên mọi đường link đã gửi."
                    : "Bạn sẽ nhận link thiệp để gửi khách và một link quản lý bí mật để sửa thiệp, xem xác nhận tham dự."}
                </p>
                <ul style={{ margin: 0, paddingLeft: 18, color: "var(--muted)" }}>
                  <li>
                    {input.groom.short || "…"} &amp; {input.bride.short || "…"} · {input.events.length} sự kiện · {input.timeline.length} mốc lịch trình
                  </li>
                  <li>{input.guests.length} khách có link riêng</li>
                </ul>
                {available === false && (
                  <p className="notice is-warn">Máy chủ chưa cấu hình nơi lưu thiệp nên chưa thể xuất bản. Bản nháp vẫn được giữ trên trình duyệt này.</p>
                )}
                {showErrors && issues.length > 0 && (
                  <ul className="issues">
                    {issues.slice(0, 8).map((iss, k) => (
                      <li key={k}>
                        <button type="button" onClick={() => setStep(STEP_OF[String(iss.path[0])] ?? 6)}>
                          {issueLabel(iss.path)}
                        </button>
                        : {iss.message}
                      </li>
                    ))}
                  </ul>
                )}
                {serverError && <p className="issues" style={{ listStyle: "none" }}>{serverError}</p>}
                {notice && <p className="notice">{notice}</p>}
                <div className="step-nav">
                  {mode === "edit" && edit ? (
                    <a className="btn btn-ghost" href={`/quan-ly/${edit.slug}`}>
                      ← Trang quản lý
                    </a>
                  ) : (
                    <span />
                  )}
                  <button type="button" className="btn btn-gold" onClick={submit} disabled={busy || available === false}>
                    {busy ? "Đang lưu…" : mode === "edit" ? "Lưu thay đổi" : "Xuất bản thiệp"}
                  </button>
                </div>
              </>
            )}

            {step < 6 && (
              <div className="step-nav">
                <button type="button" className="btn btn-ghost" disabled={step === 0} onClick={() => setStep(step - 1)}>
                  ← Quay lại
                </button>
                <button type="button" className="btn btn-dark" onClick={() => setStep(step + 1)}>
                  Tiếp: {STEPS[step + 1]} →
                </button>
              </div>
            )}
          </div>
        </div>

        <aside className="preview-col" aria-label="Xem trước thiệp">
          {previewTools}
          <div className="device">
            <iframe ref={frameRef} src="/xem-truoc" title="Xem trước thiệp" />
          </div>
        </aside>
      </div>

      <button type="button" className="btn btn-dark preview-fab" onClick={() => setSheet(true)}>
        Xem trước thiệp
      </button>
      {sheet && (
        <div className="preview-sheet" role="dialog" aria-label="Xem trước thiệp">
          <div className="preview-sheet-bar">
            {previewTools}
            <button type="button" className="btn btn-sm btn-gold" onClick={() => setSheet(false)}>
              Đóng
            </button>
          </div>
          <iframe ref={frameRef} src="/xem-truoc" title="Xem trước thiệp" />
        </div>
      )}
    </>
  );
}
