import type { Metadata } from "next";
import { Inter } from "next/font/google";
import StoreProvider from "@/store/provider";
import { AppChrome } from "@/components/layout/AppChrome";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "3D Game",
  description: "Premium 3D Prints & Custom Models",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-white text-text-primary">
        <StoreProvider>
          <AppChrome>{children}</AppChrome>
        </StoreProvider>
      </body>
    </html>
  );
}
