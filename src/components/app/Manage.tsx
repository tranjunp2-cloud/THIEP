"use client";

import { useEffect, useMemo, useState } from "react";
import { dotDate, longDate, mainEvent } from "@/lib/wedding/format";
import type { Wedding } from "@/lib/wedding/types";
import { absolute, forgetMine, readMine, rememberMine, tokenFromHash, type MineEntry } from "./mine";
import { AppTop, CopyButton, LinkRow } from "./ui";
import { useAuth } from "../auth/AuthProvider";

type Rsvp = {
  id: string;
  guest_key: string;
  name: string;
  attendance: "yes" | "no";
  party_size: number;
  side: string;
  message: string;
  created_at: string;
};

const fmtTime = (iso: string) => {
  const d = new Date(iso);
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
};

function downloadCsv(w: Wedding, rsvps: Rsvp[]) {
  const esc = (v: string | number) => `"${String(v).replace(/"/g, '""')}"`;
  const rows = [
    ["Thời gian", "Tên", "Tham dự", "Số người", "Bên", "Link khách", "Lời chúc"],
    ...rsvps.map((r) => [fmtTime(r.created_at), r.name, r.attendance === "yes" ? "Có" : "Không", r.party_size, r.side, r.guest_key, r.message]),
  ];
  const csv = "﻿" + rows.map((r) => r.map(esc).join(",")).join("\n"); // BOM để Excel đọc đúng tiếng Việt
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = `xac-nhan-${w.slug}.csv`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function Manage({ slug }: { slug: string }) {
  const auth = useAuth();
  const [token, setToken] = useState("");
  const [data, setData] = useState<{ wedding: Wedding; rsvps: Rsvp[]; canClaim?: boolean; mine?: boolean } | null>(null);
  const [error, setError] = useState("");
  const [claimMsg, setClaimMsg] = useState("");
  const [reload, setReload] = useState(0);

  useEffect(() => {
    if (auth.loading) return; // đợi biết đã đăng nhập hay chưa
    const t = tokenFromHash() || readMine().find((m) => m.slug === slug)?.token || "";
    fetch(`/api/weddings/${encodeURIComponent(slug)}/rsvps`, { headers: { Authorization: `Bearer ${t}` }, cache: "no-store" })
      .then(async (r) => {
        const d = await r.json();
        if (!r.ok) throw new Error(d?.error ?? "Không tải được dữ liệu.");
        setData(d);
        setToken(t);
        rememberMine({ slug, token: t, title: `${d.wedding.groom.short} & ${d.wedding.bride.short}`, savedAt: new Date().toISOString() });
        if (window.location.hash) history.replaceState(null, "", window.location.pathname); // giấu token khỏi thanh địa chỉ
      })
      .catch((e) => setError(e.message));
  }, [slug, auth.loading, auth.user, reload]);

  async function claim() {
    setClaimMsg("");
    const r = await fetch(`/api/weddings/${encodeURIComponent(slug)}/claim`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: "{}",
    });
    const d = await r.json().catch(() => ({}));
    if (!r.ok) return setClaimMsg(d?.error ?? "Chưa lưu được.");
    setClaimMsg("Đã lưu thiệp vào tài khoản của bạn.");
    setReload((n) => n + 1);
  }

  const stats = useMemo(() => {
    if (!data) return null;
    // Mỗi khách lấy phản hồi mới nhất.
    const latest = new Map<string, Rsvp>();
    for (const r of [...data.rsvps].reverse()) latest.set(r.guest_key || `anon:${r.id}`, r);
    const list = [...latest.values()];
    const yes = list.filter((r) => r.attendance === "yes");
    return {
      latest,
      yes: yes.length,
      people: yes.reduce((s, r) => s + r.party_size, 0),
      no: list.length - yes.length,
      pending: data.wedding.guests.filter((g) => !latest.has(g.key)).length,
    };
  }, [data]);

  if (error) {
    return (
      <>
        <AppTop />
        <div className="center-page">
          <div className="panel">
            <h1>Không mở được trang quản lý</h1>
            <p className="panel-lead">
              {error} {auth.enabled && !auth.user ? "Nếu thiệp nằm trong tài khoản của bạn, hãy đăng nhập. " : ""}Hoặc mở lại bằng đúng link
              quản lý bạn nhận khi xuất bản thiệp.
            </p>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {auth.enabled && !auth.user && (
                <button type="button" className="btn btn-dark" onClick={() => auth.openAuth("login", `/quan-ly/${slug}`)}>
                  Đăng nhập
                </button>
              )}
              <a href="/quan-ly" className="btn btn-ghost">
                Thiệp của tôi
              </a>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (!data || !stats) {
    return (
      <>
        <AppTop />
        <div className="center-page">
          <p>Đang tải…</p>
        </div>
      </>
    );
  }

  const w = data.wedding;
  const e = mainEvent(w);
  const link = (k?: string) => absolute(`/thiep/${w.slug}${k ? `?k=${k}` : ""}`);
  const manageLink = absolute(`/quan-ly/${w.slug}#t=${token}`);

  return (
    <>
      <AppTop>
        <a className="btn btn-ghost btn-sm" href="/quan-ly">
          Thiệp của tôi
        </a>
        <a className="btn btn-dark btn-sm" href={`/tao-thiep?sua=${w.slug}#t=${token}`}>
          Sửa thiệp
        </a>
      </AppTop>

      <main className="manage">
        <div className="manage-head">
          <div>
            <p className="eyebrow">
              {dotDate(e.start)} · {e.venue}
            </p>
            <h1>
              {w.groom.short} &amp; {w.bride.short}
            </h1>
            <p style={{ margin: "6px 0 0", color: "var(--muted)" }}>{longDate(e.start)}</p>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <a className="btn btn-ghost" href={link()} target="_blank" rel="noreferrer">
              Xem thiệp
            </a>
            <button type="button" className="btn btn-ghost" onClick={() => downloadCsv(w, data.rsvps)} disabled={!data.rsvps.length}>
              Tải danh sách (CSV)
            </button>
          </div>
        </div>

        {data.canClaim && (
          <div className="notice is-warn" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap", marginTop: 0, marginBottom: 20 }}>
            <span>Thiệp này đang được quản lý bằng link bí mật. Lưu vào tài khoản để mở lại trên mọi thiết bị.</span>
            <button type="button" className="btn btn-dark btn-sm" onClick={claim}>
              Lưu vào tài khoản
            </button>
          </div>
        )}
        {claimMsg && <p className="notice" style={{ marginTop: 0, marginBottom: 20 }}>{claimMsg}</p>}

        <div className="stats">
          <div className="stat is-dark">
            <b>{stats.people}</b>
            <span>người sẽ đến</span>
          </div>
          <div className="stat">
            <b>{stats.yes}</b>
            <span>phản hồi “sẽ đến”</span>
          </div>
          <div className="stat">
            <b>{stats.no}</b>
            <span>không đến được</span>
          </div>
          <div className="stat">
            <b>{stats.pending}</b>
            <span>khách chưa phản hồi</span>
          </div>
        </div>

        <div className="manage-grid">
          <section className="panel">
            <h2>Link gửi khách</h2>
            <p className="panel-lead" style={{ marginBottom: 8 }}>
              Link riêng hiện tên khách trên bìa thiệp và trong ảnh xem trước khi gửi qua Zalo, Messenger.
            </p>
            <b style={{ fontSize: 14 }}>Link chung</b>
            <LinkRow url={link()} />
            {w.guests.length === 0 ? (
              <p className="empty">
                Chưa có khách nào. <a href={`/tao-thiep?sua=${w.slug}#t=${token}`}>Thêm khách mời</a>
              </p>
            ) : (
              <table className="guest-table">
                <thead>
                  <tr>
                    <th>Khách ({w.guests.length})</th>
                    <th>Trạng thái</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {w.guests.map((g) => {
                    const r = stats.latest.get(g.key);
                    return (
                      <tr key={g.key}>
                        <td>
                          {g.name}
                          <div className="wish-meta">{g.side}</div>
                        </td>
                        <td>
                          {r ? (
                            r.attendance === "yes" ? (
                              <span className="status status-yes">Sẽ đến · {r.party_size} người</span>
                            ) : (
                              <span className="status status-no">Không đến</span>
                            )
                          ) : (
                            <span className="status status-none">Chưa phản hồi</span>
                          )}
                        </td>
                        <td style={{ textAlign: "right" }}>
                          <CopyButton text={link(g.key)} />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
            <div className="secret">
              <b>Link quản lý (bí mật)</b>
              <LinkRow url={manageLink} label="Chép" />
            </div>
          </section>

          <section className="panel">
            <h2>Sổ lời chúc &amp; phản hồi</h2>
            {data.rsvps.length === 0 ? (
              <p className="empty">Chưa có phản hồi nào. Khi khách xác nhận trên thiệp, lời chúc sẽ hiện ở đây.</p>
            ) : (
              <ul className="wish-list">
                {data.rsvps.map((r) => (
                  <li key={r.id}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 8, flexWrap: "wrap" }}>
                      <b>{r.name}</b>
                      <span className={`status ${r.attendance === "yes" ? "status-yes" : "status-no"}`}>
                        {r.attendance === "yes" ? `Sẽ đến · ${r.party_size} người` : "Không đến"}
                      </span>
                    </div>
                    <div className="wish-meta">
                      {fmtTime(r.created_at)}
                      {r.side && ` · Khách ${r.side.toLowerCase()}`}
                      {!r.guest_key && " · qua link chung"}
                    </div>
                    {r.message && <p>“{r.message}”</p>}
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </main>
    </>
  );
}

type Owned = { slug: string; title: string; date: string };

export function MineList() {
  const auth = useAuth();
  const [items, setItems] = useState<MineEntry[] | null>(null);
  const [owned, setOwned] = useState<Owned[] | null>(null);
  const [msg, setMsg] = useState("");
  const [tick, setTick] = useState(0);

  // eslint-disable-next-line react-hooks/set-state-in-effect -- localStorage chỉ có ở trình duyệt
  useEffect(() => setItems(readMine()), [tick]);

  useEffect(() => {
    if (!auth.user) return;
    fetch("/api/me/weddings", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d) => setOwned(d.weddings))
      .catch(() => setOwned([]));
  }, [auth.user, tick]);

  async function claim(m: MineEntry) {
    setMsg("");
    const r = await fetch(`/api/weddings/${encodeURIComponent(m.slug)}/claim`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${m.token}` },
      body: "{}",
    });
    const d = await r.json().catch(() => ({}));
    setMsg(r.ok ? `Đã lưu “${m.title}” vào tài khoản.` : (d?.error ?? "Chưa lưu được."));
    setTick((n) => n + 1);
  }

  const ownedSlugs = new Set((owned ?? []).map((o) => o.slug));
  const deviceOnly = (items ?? []).filter((m) => !ownedSlugs.has(m.slug));
  const dmy = (d: string) => d.split("-").reverse().join("/");

  return (
    <>
      <AppTop>
        <a className="btn btn-dark btn-sm" href="/tao-thiep">
          + Tạo thiệp mới
        </a>
      </AppTop>
      <div className="center-page">
        <div className="panel" style={{ maxWidth: 720 }}>
          <h1>Thiệp của tôi</h1>

          {auth.enabled && !auth.loading && !auth.user && (
            <div className="notice is-warn" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
              <span>Đăng nhập để xem thiệp trong tài khoản trên mọi thiết bị.</span>
              <button type="button" className="btn btn-dark btn-sm" onClick={() => auth.openAuth("login")}>
                Đăng nhập
              </button>
            </div>
          )}
          {msg && <p className="notice">{msg}</p>}

          {auth.user && (
            <>
              <h2 className="section-gap">Trong tài khoản</h2>
              {owned === null ? (
                <p className="panel-lead">Đang tải…</p>
              ) : owned.length === 0 ? (
                <p className="empty">
                  Chưa có thiệp nào trong tài khoản. <a href="/tao-thiep">Tạo thiệp đầu tiên</a>
                </p>
              ) : (
                <ul className="mine-list">
                  {owned.map((o) => (
                    <li key={o.slug}>
                      <div>
                        <b>{o.title}</b>
                        <div className="wish-meta">
                          {o.date ? dmy(o.date) + " · " : ""}/thiep/{o.slug}
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                        <a className="btn btn-ghost btn-sm" href={`/thiep/${o.slug}`} target="_blank" rel="noreferrer">
                          Xem
                        </a>
                        <a className="btn btn-dark btn-sm" href={`/quan-ly/${o.slug}`}>
                          Quản lý
                        </a>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}

          <h2 className="section-gap">{auth.user ? "Chỉ có trên thiết bị này" : "Trên thiết bị này"}</h2>
          <p className="panel-lead" style={{ marginBottom: 0 }}>
            Thiệp mở bằng link quản lý trên trình duyệt này{auth.user ? " nhưng chưa thuộc tài khoản" : ""}.
          </p>
          {items === null ? null : deviceOnly.length === 0 ? (
            <p className="empty">Không có thiệp nào.</p>
          ) : (
            <ul className="mine-list">
              {deviceOnly.map((m) => (
                <li key={m.slug}>
                  <div>
                    <b>{m.title}</b>
                    <div className="wish-meta">/thiep/{m.slug}</div>
                  </div>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                    {auth.user && (
                      <button type="button" className="btn btn-ghost btn-sm" onClick={() => claim(m)}>
                        Lưu vào tài khoản
                      </button>
                    )}
                    <a className="btn btn-dark btn-sm" href={`/quan-ly/${m.slug}`}>
                      Quản lý
                    </a>
                    <button
                      type="button"
                      className="btn-link btn-danger"
                      onClick={() => {
                        forgetMine(m.slug);
                        setTick((n) => n + 1);
                      }}
                    >
                      Bỏ khỏi thiết bị
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
}
