import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { queryDB } from "@/lib/db";
import { randomUUID } from "crypto";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function POST(req: NextRequest) {
    try {
        const { username, password } = await req.json();
        const now = new Date();


        // Ambil IP & User-Agent
        const ip =
            req.headers.get("x-forwarded-for")?.split(",")[0] ||
            req.headers.get("x-real-ip") ||
            "UNKNOWN";

        const userAgent = req.headers.get("user-agent") || "UNKNOWN";

        const ua = userAgent.toLowerCase();

        const browser =
            ua.includes("chrome") ? "Chrome" :
                ua.includes("firefox") ? "Firefox" :
                    ua.includes("safari") ? "Safari" : "Other";

        const os =
            ua.includes("windows") ? "Windows" :
                ua.includes("android") ? "Android" :
                    ua.includes("iphone") ? "iOS" : "Other";

        const deviceType =
            ua.includes("mobile") ? "Mobile" : "Desktop";

        if (!username || !password) {
            return NextResponse.json(
                { success: false, message: "Username and password are required" },
                { status: 400 }
            );
        }








        // Cari user
        const result = await queryDB(
            `SELECT * FROM user_dashboards WHERE username = @Username`,
            { Username: username }
        );

        // User tidak ditemukan
        if (result.length === 0) {
            await queryDB(
                `INSERT INTO login_logs
                 (username, ip_address, user_agent, login_status, failure_reason, browser, os, device_type, created_at)
                 VALUES (@Username, @IP, @UA, 'FAILED', 'USER_NOT_FOUND', @Browser, @OS, @DeviceType, @CreatedAt)`,
                {
                    Username: username,
                    IP: ip,
                    UA: userAgent,
                    Browser: browser,
                    OS: os,
                    DeviceType: deviceType,
                    CreatedAt: now
                }
            );

            return NextResponse.json(
                { success: false, message: "User not found" },
                { status: 404 }
            );
        }

        const user = result[0];

        // Cek password
        const valid = await bcrypt.compare(password, user.password);

        if (!valid) {
            await queryDB(
                `INSERT INTO login_logs
                 (user_id, username, ip_address, user_agent, login_status, failure_reason, browser, os, device_type, created_at)
                 VALUES (@UserId, @Username, @IP, @UA, 'FAILED', 'WRONG_PASSWORD', @Browser, @OS, @DeviceType, @CreatedAt)`,
                {
                    UserId: user.id,
                    Username: username,
                    IP: ip,
                    UA: userAgent,
                    Browser: browser,
                    OS: os,
                    DeviceType: deviceType,
                    CreatedAt: now
                }
            );

            return NextResponse.json(
                { success: false, message: "Invalid credentials" },
                { status: 401 }
            );
        }

        // Generate JWT
        // const token = jwt.sign(
        //     { id: user.id, username: user.username, email: user.email },
        //     JWT_SECRET,
        //     { expiresIn: "2h" }
        // );

        const sessionId = randomUUID();
        const token = jwt.sign(
            {
                id: user.id,
                username: user.username,
                email: user.email,
                jti: sessionId
            },
            JWT_SECRET,
            { expiresIn: "2h" }
        );

        // Log sukses
        await queryDB(
            `INSERT INTO login_logs
             (user_id, username, ip_address, user_agent, login_status, browser, os, device_type, login_at, created_at, session_id)
             VALUES (@UserId, @Username, @IP, @UA, 'SUCCESS', @Browser, @OS, @DeviceType, @LoginAt, @CreatedAt, @SessionId)`,
            {
                UserId: user.id,
                Username: username,
                IP: ip,
                UA: userAgent,
                Browser: browser,
                OS: os,
                DeviceType: deviceType,
                LoginAt: now,
                CreatedAt: now,
                SessionId: sessionId
            }
        );

        // Response
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

        // Cookie JWT
        res.cookies.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 2, // 2 jam
        });

        return res;

    } catch (err) {
        console.error("LOGIN ERROR:", err);

        return NextResponse.json(
            { success: false, message: "Server error" },
            { status: 500 }
        );
    }
}


// import { queryDB } from "@/lib/db";
// import { NextRequest, NextResponse } from "next/server";
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";

// const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

// export async function POST(req: NextRequest) {
//     try {
//         const { username, password } = await req.json();

//         if (!username || !password) {
//             return NextResponse.json(
//                 { success: false, message: "Username and password are required" },
//                 { status: 400 }
//             );
//         }

//         const result = await queryDB(
//             `SELECT * FROM user_dashboards WHERE username = @Username`,
//             { Username: username }
//         );

//         if (result.length === 0) {
//             return NextResponse.json(
//                 { success: false, message: "User not found" },
//                 { status: 404 }
//             );
//         }

//         const user = result[0];

//         const valid = await bcrypt.compare(password, user.password);
//         if (!valid) {
//             return NextResponse.json(
//                 { success: false, message: "Invalid credentials" },
//                 { status: 401 }
//             );
//         }

//         // Generate JWT
//         const token = jwt.sign(
//             { id: user.id, username: user.username, email: user.email },
//             JWT_SECRET,
//             { expiresIn: "2h" }
//         );

//         // Siapkan response
//         const res = NextResponse.json({
//             success: true,
//             message: "Login successful",
//             data: {
//                 user: {
//                     id: user.id,
//                     username: user.username,
//                     email: user.email,
//                     name: user.name || null,
//                 },
//                 expiresIn: 7200,
//             },
//         });

//         // Simpan token ke cookie (HttpOnly)
//         res.cookies.set("token", token, {
//             httpOnly: true,
//             secure: false,
//             sameSite: "lax",
//             path: "/",
//             maxAge: 7200, // 2 jam
//         });

//         return res;

//     } catch (err) {
//         console.error(err);
//         return NextResponse.json(
//             { success: false, message: "Server error" },
//             { status: 500 }
//         );
//     }
// }
