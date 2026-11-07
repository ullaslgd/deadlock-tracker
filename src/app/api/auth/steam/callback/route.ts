
import { NextRequest, NextResponse } from "next/server";
import { RelyingParty } from "openid";

export async function GET(request: NextRequest) {
  try {
    const appUrl = process.env.APP_URL;
    const stateFromUrl = request.nextUrl.searchParams.get("state");
    const stateFromCookie = request.cookies.get(
      "steam_login_state"
    )?.value;

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

    expectedReturnUrl.searchParams.set("state", stateFromCookie);

    const returnedUrl = request.nextUrl.searchParams.get(
      "openid.return_to"
    );

    if (returnedUrl !== expectedReturnUrl.toString()) {
      return NextResponse.json(
        { error: "Invalid OpenID return URL" },
        { status: 400 }
      );
    }

    const relyingParty = new RelyingParty(
      expectedReturnUrl.toString(),
      baseUrl.origin + "/",
      false,
      true,
      []
    );

    const result = await new Promise<{
      authenticated: boolean;
      claimedIdentifier?: string;
    }>((resolve, reject) => {
      relyingParty.verifyAssertion(request.url, (error, response) => {
        if (error || !response) {
          reject(error ?? new Error("Missing OpenID response"));
          return;
        }

        resolve(response);
      });
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

    const response = NextResponse.json({
      success: true,
      message: "Steam identity verified successfully!",
      steamId64,
    });

    response.cookies.delete("steam_login_state");

    return response;
  } catch (error) {
    console.error("Steam callback error:", error);

    return NextResponse.json(
      { error: "Steam authentication could not be completed" },
      { status: 500 }
    );
  }
}
