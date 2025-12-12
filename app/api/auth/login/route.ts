import { queryDB } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

export async function POST(req: NextRequest) {
    try {
        const { username, password } = await req.json();

        if (!username || !password) {
            return NextResponse.json(
                { success: false, message: "Username and password are required" },
                { status: 400 }
            );
        }

        const result = await queryDB(
            `SELECT * FROM user_dashboards WHERE username = @Username`,
            { Username: username }
        );

        if (result.length === 0) {
            return NextResponse.json(
                { success: false, message: "User not found" },
                { status: 404 }
            );
        }

        const user = result[0];

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) {
            return NextResponse.json(
                { success: false, message: "Invalid credentials" },
                { status: 401 }
            );
        }

        // Generate JWT
        const token = jwt.sign(
            { id: user.id, username: user.username, email: user.email },
            JWT_SECRET,
            { expiresIn: "2h" }
        );

        // Siapkan response
        const res = NextResponse.json({
            success: true,
            message: "Login successful",
            data: {
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    name: user.name || null,
                },
                expiresIn: 7200,
            },
        });

        // Simpan token ke cookie (HttpOnly)
        res.cookies.set("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "none",
            path: "/",
            maxAge: 7200, // 2 jam
        });

        return res;

    } catch (err) {
        console.error(err);
        return NextResponse.json(
            { success: false, message: "Server error" },
            { status: 500 }
        );
    }
}
