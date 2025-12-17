import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { queryDB } from "@/lib/db";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;

    if (token) {
      const decoded: any = jwt.verify(token, JWT_SECRET);

      if (decoded?.jti) {
        await queryDB(
          `UPDATE login_logs
           SET logout_at = GETDATE()
           WHERE session_id = @SessionId
             AND logout_at IS NULL`,
          { SessionId: decoded.jti }
        );
      }
    }

    const res = NextResponse.json({
      success: true,
      message: "Logged out"
    });

    res.cookies.set("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      expires: new Date(0),
    });

    return res;

  } catch (err) {
    console.error("LOGOUT ERROR:", err);

    return NextResponse.json(
      { success: false, message: "Logout failed" },
      { status: 500 }
    );
  }
}


// import { NextResponse } from "next/server";

// export async function POST() {
//   const res = NextResponse.json({
//     success: true,
//     message: "Logged out"
//   });

//   // hapus cookie token
//   res.cookies.set("token", "", {
//     httpOnly: true,
//     secure: false, // true kalau production HTTPS
//     sameSite: "lax",
//     path: "/",
//     expires: new Date(0),  // expired langsung
//   });

//   return res;
// }
