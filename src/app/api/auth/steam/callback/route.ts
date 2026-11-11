
import { NextRequest, NextResponse } from "next/server";
import { RelyingParty } from "openid";
import { prisma } from "@/lib/prisma";
import { createSession } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const appUrl = process.env.APP_URL;

    const stateFromUrl =
      request.nextUrl.searchParams.get("state");

    const stateFromCookie =
      request.cookies.get("steam_login_state")?.value;

    if (
      !appUrl ||
      !stateFromUrl ||
      !stateFromCookie ||
      stateFromUrl !== stateFromCookie
    ) {
      return NextResponse.json(
        { error: "Invalid or expired login state" },
        { status: 400 }
      );
    }

    const baseUrl = new URL(appUrl);

    const expectedReturnUrl = new URL(
      "/api/auth/steam/callback",
      baseUrl
    );

    expectedReturnUrl.searchParams.set(
      "state",
      stateFromCookie
    );

    const returnedUrl =
      request.nextUrl.searchParams.get("openid.return_to");

    if (!returnedUrl) {
      return NextResponse.json(
        { error: "Missing OpenID return URL" },
        { status: 400 }
      );
    }

    const actualReturnUrl = new URL(returnedUrl);

    if (
      actualReturnUrl.origin !== expectedReturnUrl.origin ||
      actualReturnUrl.pathname !== expectedReturnUrl.pathname ||
      actualReturnUrl.searchParams.get("state") !== stateFromCookie
    ) {
      return NextResponse.json(
        { error: "Invalid OpenID return URL" },
        { status: 400 }
      );
    }

    const relyingParty = new RelyingParty(
      expectedReturnUrl.toString(),
      baseUrl.origin + "/",
      true,
      true,
      []
    );

    const result = await new Promise<{
      authenticated: boolean;
      claimedIdentifier?: string;
    }>((resolve, reject) => {
      relyingParty.verifyAssertion(
        request.url,
        (error, response) => {
          if (error || !response) {
            reject(error ?? new Error("Missing OpenID response"));
            return;
          }

          resolve(response);
        }
      );
    });

    if (!result.authenticated || !result.claimedIdentifier) {
      return NextResponse.json(
        { error: "Steam authentication failed" },
        { status: 401 }
      );
    }

    const claimedId = new URL(result.claimedIdentifier);

    if (
      !["http:", "https:"].includes(claimedId.protocol) ||
      claimedId.hostname !== "steamcommunity.com" ||
      !claimedId.pathname.startsWith("/openid/id/")
    ) {
      return NextResponse.json(
        { error: "Invalid Steam identity" },
        { status: 401 }
      );
    }

    const steamId64 = claimedId.pathname.split("/").pop();

    if (!steamId64 || !/^\d{17}$/.test(steamId64)) {
      return NextResponse.json(
        { error: "Invalid SteamID64" },
        { status: 401 }
      );
    }

    const user = await prisma.user.upsert({
      where: { steamId64 },
      update: {},
      create: {
        steamId64,
        personaName: `Player_${steamId64.slice(-6)}`,
        profileUrl: `https://steamcommunity.com/profiles/${steamId64}`,
      },
    });

    const response = NextResponse.redirect(
      new URL("/dashboard", baseUrl)
    );

    await createSession(user.id);

    response.cookies.delete("steam_login_state");

    return response;

  } catch (error) {
    console.error("Steam callback error:");
    console.dir(error, { depth: 10 });

    return NextResponse.json(
      { error: "Steam authentication could not be completed" },
      { status: 500 }
    );
  }
}
