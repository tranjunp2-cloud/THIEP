"use client";

import { useEffect, useState } from "react";
import { demoWedding } from "@/lib/wedding/demo";
import type { Wedding } from "@/lib/wedding/types";
import { Invitation } from "./Invitation";

type Msg = { type: "duyen:preview"; wedding: Wedding; guestKey: string; open: boolean };

/** Trang chạy trong iframe của trang tạo thiệp; nhận dữ liệu qua postMessage cùng nguồn. */
export function PreviewFrame() {
  const [state, setState] = useState<Omit<Msg, "type">>({ wedding: demoWedding, guestKey: "", open: false });

  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if (e.origin !== window.location.origin) return;
      const data = e.data as Partial<Msg>;
      if (data?.type !== "duyen:preview" || !data.wedding) return;
      setState({ wedding: data.wedding, guestKey: data.guestKey ?? "", open: Boolean(data.open) });
    };
    window.addEventListener("message", onMessage);
    window.parent?.postMessage({ type: "duyen:preview-ready" }, window.location.origin);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  const guest = state.wedding.guests.find((g) => g.key === state.guestKey);
  return (
    <Invitation
      key={`${state.open}-${state.guestKey}`}
      wedding={state.wedding}
      guest={guest}
      preview
      startOpen={state.open}
    />
  );
}
