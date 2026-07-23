import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NEXTTRADE - Master Indian Markets Before You Invest",
  description: "NEXTTRADE V1 - India's #1 Paper Trading Platform. Practice stock market trading with virtual money, real-time data, F&O trading, options chain, and more. Zero risk, real learning.",
  keywords: [
    "NEXTTRADE", 
    "paper trading", 
    "stock market simulator", 
    "Indian stock market",
    "NSE trading",
    "options trading",
    "futures trading",
    "virtual trading",
    "demo trading",
    "F&O practice",
    "NIFTY",
    "BANK NIFTY"
  ],
  authors: [{ name: "NEXTTRADE Team" }],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "NEXTTRADE - Master Indian Markets",
    description: "Practice trading with ₹10L+ virtual money. Real-time NSE data, F&O, Options Chain. Zero risk, real learning.",
    url: "https://nexttrade.app",
    siteName: "NEXTTRADE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "NEXTTRADE - Paper Trading Platform",
    description: "Master Indian markets before you invest. Free paper trading platform.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
