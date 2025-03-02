import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import TweetInitializer from "@/components/feed/TweetInitializer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Talking Objects",
  description: "Bring real-world objects to life with interactive conversations",
  keywords: ["talking objects", "interactive", "conversations", "location-aware"],
  authors: [{ name: "Talking Objects Team" }],
  viewport: "width=device-width, initial-scale=1",
  icons: {
    icon: [{ url: "/chat-bubble.svg" }],
    apple: [{ url: "/chat-bubble.svg" }],
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://talkingobjects.ai",
    title: "Talking Objects",
    description: "Bring real-world objects to life with interactive conversations",
    siteName: "Talking Objects",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Talking Objects - Bring objects to life through conversations",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Talking Objects",
    description: "Bring real-world objects to life with interactive conversations",
    images: ["/images/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen bg-gray-950 text-white`}
      >
        <TweetInitializer />
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
