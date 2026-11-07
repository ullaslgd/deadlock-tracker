import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; 

export async function GET() {
  try {
    await prisma.$connect();

    const users = await prisma.user.count();

    return NextResponse.json({
      success: true,
      message: "Neon database connected successfully!",
      totalUsers: users,
    });
  } catch (error) {
    console.error("Database connection failed:", error);

    return NextResponse.json(
      { success: false, message: "Database connection failed" },
      { status: 500 }
    );
  }
}