/**
 * API Route: POST /api/auth/session
 * Creates a session from Firebase ID token
 * 
 * Usage:
 * await fetch("/api/auth/session", {
 *   method: "POST",
 *   headers: { "Content-Type": "application/json" },
 *   body: JSON.stringify({ idToken })
 * });
 */

import { adminAuth } from "@/lib/firebase-admin";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { idToken } = await request.json();

    if (!idToken) {
      return NextResponse.json(
        { error: "ID token is required" },
        { status: 400 }
      );
    }

    // Verify the ID token
    const decodedToken = await adminAuth.verifyIdToken(idToken);

    if (!decodedToken.phone_number) {
      return NextResponse.json(
        { error: "Phone number not verified" },
        { status: 400 }
      );
    }

    // Create session cookie (optional: you can also store in DB)
    const cookieStore = await cookies();
    cookieStore.set("firebaseSession", idToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return NextResponse.json({
      success: true,
      uid: decodedToken.uid,
      phoneNumber: decodedToken.phone_number,
    });
  } catch (error) {
    console.error("Session creation error:", error);
    return NextResponse.json(
      { error: "Failed to create session" },
      { status: 401 }
    );
  }
}

/**
 * API Route: POST /api/auth/logout
 * Clears the session
 */
export async function DELETE(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    cookieStore.delete("firebaseSession");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { error: "Failed to logout" },
      { status: 500 }
    );
  }
}
