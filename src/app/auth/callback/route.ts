import type { EmailOtpType } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { authEnabled, safeNext } from "@/lib/supabase/config";
import { supabaseServer } from "@/lib/supabase/server";

/**
 * Điểm quay về sau khi:
 * - đăng nhập Google / Facebook (?code=…)
 * - bấm link xác nhận email hoặc đặt lại mật khẩu (?code=… hoặc ?token_hash=…&type=…)
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const next = safeNext(url.searchParams.get("next"));
  const fail = (reason: string) => NextResponse.redirect(new URL(`/?auth_error=${encodeURIComponent(reason)}`, url.origin));

  if (!authEnabled) return fail("not_configured");
  const providerError = url.searchParams.get("error_description") || url.searchParams.get("error");
  if (providerError) return fail(providerError);

  const sb = await supabaseServer();
  const code = url.searchParams.get("code");
  const tokenHash = url.searchParams.get("token_hash");
  const type = url.searchParams.get("type") as EmailOtpType | null;

  if (code) {
    const { error } = await sb.auth.exchangeCodeForSession(code);
    if (error) return fail(error.message);
  } else if (tokenHash && type) {
    const { error } = await sb.auth.verifyOtp({ type, token_hash: tokenHash });
    if (error) return fail(error.message);
  } else {
    return fail("missing_code");
  }

  const dest = type === "recovery" ? "/dat-lai-mat-khau" : next;
  return NextResponse.redirect(new URL(dest, url.origin));
}
