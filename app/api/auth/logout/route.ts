import { adminAuth } from "@/lib/firebase-admin";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get("firebaseSession");

    if (session?.value) {
      try {
        const decoded = await adminAuth.verifyIdToken(session.value, true);
        await adminAuth.revokeRefreshTokens(decoded.uid);
      } catch {
        // Token already expired or invalid — still proceed to clear the cookie
      }
    }

    cookieStore.delete("firebaseSession");
    return NextResponse.json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json({ error: "Failed to logout" }, { status: 500 });
  }
}
