
import { NextResponse } from "next/server";

const API_URL = "https://api.deadlock-api.com/v1/assets/items";

export async function GET() {
  try {
    const response = await fetch(API_URL, {
      cache: "no-store",
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch Deadlock items" },
        { status: response.status }
      );
    }

    const items = await response.json();

    return NextResponse.json(items);
  } catch (error) {
    console.error("Items API error:", error);

    return NextResponse.json(
      { error: "Unable to fetch items" },
      { status: 500 }
    );
  }
}
