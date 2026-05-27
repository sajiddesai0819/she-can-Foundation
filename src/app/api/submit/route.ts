import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { contactFormSchema } from "@/lib/validation";
import { initializeDatabase } from "@/lib/seed";

export async function POST(request: Request) {
  try {
    await initializeDatabase();

    const body = await request.json();
    const parsed = contactFormSchema.safeParse(body);

    if (!parsed.success) {
      const errors = parsed.error.flatten().fieldErrors;
      return NextResponse.json(
        { success: false, message: "Validation failed", errors },
        { status: 400 }
      );
    }

    const { name, email, message } = parsed.data;

    await prisma.submission.create({
      data: { name, email, message },
    });

    return NextResponse.json({
      success: true,
      message: "Form Submitted Successfully",
    });
  } catch (error) {
    console.error("Submit error:", error);
    return NextResponse.json(
      { success: false, message: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
