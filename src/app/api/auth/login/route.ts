import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import {
  createAdminToken,
  setAuthCookie,
  verifyPassword,
} from "@/lib/auth";
import { loginSchema } from "@/lib/validation";
import { initializeDatabase } from "@/lib/seed";

export async function POST(request: Request) {
  try {
    await initializeDatabase();

    const body = await request.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: "Invalid credentials" },
        { status: 400 }
      );
    }

    const { email, password } = parsed.data;
    const admin = await prisma.admin.findUnique({ where: { email } });

    if (!admin || !(await verifyPassword(password, admin.passwordHash))) {
      return NextResponse.json(
        { success: false, message: "Invalid email or password" },
        { status: 401 }
      );
    }

    const token = await createAdminToken(admin.id, admin.email);
    await setAuthCookie(token);

    return NextResponse.json({ success: true, email: admin.email });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { success: false, message: "Login failed" },
      { status: 500 }
    );
  }
}
