import { NextRequest, NextResponse } from "next/server";
import { queryDB } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const { username, email, password, name } = await req.json();

    if (!username || !email || !password || !name) {
      return NextResponse.json(
        { message: "Email, password, and name are required" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert ke database
    await queryDB(
      `INSERT INTO user_dashboards (username, email, password, name) VALUES ( @Username, @Email, @Password, @Name)`,
      {
        Username: username,
        Email: email,
        Password: hashedPassword,
        Name: name,
      }
    );

    return NextResponse.json({ message: "User created successfully" });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ message: err.message || "Server error" }, { status: 500 });
  }
}
