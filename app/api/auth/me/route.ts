import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json({ success: false, user: null }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    return NextResponse.json({
      success: true,
      user: decoded, // { id, username, email }
    });
  } catch {
    return NextResponse.json({ success: false, user: null }, { status: 401 });
  }
}
