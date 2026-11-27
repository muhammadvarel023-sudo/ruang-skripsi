import { NextResponse } from "next/server";
import { setAdminSessionCookie, verifyAdminCredentials } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = String(body.email || "");
    const password = String(body.password || "");

    if (!verifyAdminCredentials(email, password)) {
      return NextResponse.json(
        { error: "Email atau kata sandi tidak sesuai." },
        { status: 401 }
      );
    }

    await setAdminSessionCookie(email);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Permintaan login tidak valid." },
      { status: 400 }
    );
  }
}
