import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  phone: string;
  otpDigits: string[];
  termsAgreed: boolean;
}

const initialState: AuthState = {
  phone: "",
  otpDigits: ["", "", "", ""],
  termsAgreed: false,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setPhone(state, action: PayloadAction<string>) {
      state.phone = action.payload;
    },
    appendPhoneDigit(state, action: PayloadAction<string>) {
      state.phone += action.payload;
    },
    backspacePhone(state) {
      state.phone = state.phone.slice(0, -1);
    },
    setOtpDigit(state, action: PayloadAction<{ index: number; value: string }>) {
      state.otpDigits[action.payload.index] = action.payload.value;
    },
    fillNextOtpDigit(state, action: PayloadAction<string>) {
      const emptyIndex = state.otpDigits.findIndex((d) => d === "");
      if (emptyIndex !== -1) state.otpDigits[emptyIndex] = action.payload;
    },
    backspaceOtp(state) {
      const lastIndex = state.otpDigits.map((d, i) => (d ? i : -1)).filter((i) => i >= 0).pop();
      if (lastIndex !== undefined) state.otpDigits[lastIndex] = "";
    },
    resetOtp(state) {
      state.otpDigits = ["", "", "", ""];
    },
    setTermsAgreed(state, action: PayloadAction<boolean>) {
      state.termsAgreed = action.payload;
    },
  },
});

export const {
  setPhone,
  appendPhoneDigit,
  backspacePhone,
  setOtpDigit,
  fillNextOtpDigit,
  backspaceOtp,
  resetOtp,
  setTermsAgreed,
} = authSlice.actions;

export const selectOtpComplete = (state: { auth: AuthState }) =>
  state.auth.otpDigits.every((d) => d !== "");

export default authSlice.reducer;
