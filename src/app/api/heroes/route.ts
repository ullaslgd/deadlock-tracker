
import { NextResponse } from "next/server";

const API_URL = "https://api.deadlock-api.com/v1/assets/heroes";

export async function GET() {
  try {
    const response = await fetch(API_URL, {
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Deadlock API request failed" },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error("Hero API error:", error);

    return NextResponse.json(
      { error: "Unable to fetch heroes" },
      { status: 500 }
    );
  }
}
