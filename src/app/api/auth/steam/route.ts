
import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "crypto";



export async function GET(request: NextRequest) {
  const appUrl = process.env.APP_URL;

  if (!appUrl) {
    return NextResponse.json(
      { error: "APP_URL is not configured" },
      { status: 500 }
    );
  }

  const baseUrl = new URL(appUrl);

  if (
    baseUrl.protocol !== "http:" &&
    baseUrl.protocol !== "https:"
  ) {
    return NextResponse.json(
      { error: "Invalid APP_URL" },
      { status: 500 }
    );
  }

  const state = randomBytes(32).toString("hex");

  const returnUrl = new URL(
    "/api/auth/steam/callback",
    baseUrl
  );

  returnUrl.searchParams.set("state", state);

  const steamUrl = new URL(
    "https://steamcommunity.com/openid/login"
  );

  steamUrl.searchParams.set(
    "openid.ns",
    "http://specs.openid.net/auth/2.0"
  );

  steamUrl.searchParams.set(
    "openid.mode",
    "checkid_setup"
  );

  steamUrl.searchParams.set(
    "openid.return_to",
    returnUrl.toString()
  );

  steamUrl.searchParams.set(
    "openid.realm",
    baseUrl.origin + "/"
  );

  steamUrl.searchParams.set(
    "openid.identity",
    "http://specs.openid.net/auth/2.0/identifier_select"
  );

  steamUrl.searchParams.set(
    "openid.claimed_id",
    "http://specs.openid.net/auth/2.0/identifier_select"
  );

  const response = NextResponse.redirect(steamUrl);

  response.cookies.set("steam_login_state", state, {
    httpOnly: true,
    secure: baseUrl.protocol === "https:",
    sameSite: "lax",
    path: "/",
    maxAge: 600,
  });

  return response;
}
