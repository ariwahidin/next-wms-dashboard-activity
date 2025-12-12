import { NextResponse } from "next/server";

export async function POST() {
  const res = NextResponse.json({
    success: true,
    message: "Logged out"
  });

  // hapus cookie token
  res.cookies.set("token", "", {
    httpOnly: true,
    secure: false, // true kalau production HTTPS
    sameSite: "strict",
    path: "/",
    expires: new Date(0),  // expired langsung
  });

  return res;
}
