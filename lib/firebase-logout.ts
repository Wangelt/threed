/**
 * Logout and Session Management Utilities
 */

import { signOut } from "firebase/auth";
import { firebaseAuth } from "@/lib/firebase-client";
import { clearOtpConfirmation } from "@/lib/phone-otp-state";

/**
 * Sign out user and clear session
 */
export async function logoutUser(): Promise<void> {
  try {
    // Sign out from Firebase
    await signOut(firebaseAuth);

    // Clear OTP confirmation state
    clearOtpConfirmation();

    // Clear session cookie on backend
    await fetch("/api/auth/logout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    console.log("User logged out successfully");
  } catch (error) {
    console.error("Logout error:", error);
    throw error;
  }
}

/**
 * Clear all auth-related data
 */
export function clearAuthData(): void {
  clearOtpConfirmation();
  localStorage.removeItem("authToken");
  sessionStorage.removeItem("authToken");
}
