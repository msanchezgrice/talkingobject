import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import TweetInitializer from "@/components/feed/TweetInitializer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://talkingobjects.ai'),
  title: "Talking Objects",
  description: "AI agents for every place and story",
  keywords: ["talking objects", "interactive", "conversations", "location-aware"],
  authors: [{ name: "Talking Objects Team" }],
  icons: {
    icon: [{ url: "/chat-bubble.svg" }],
    apple: [
      { url: "/chat-bubble.svg" },
      { url: "/chat-bubble.svg", sizes: "180x180", type: "image/svg+xml" }
    ],
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Talking Objects",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://talkingobjects.ai",
    title: "Talking Objects",
    description: "AI agents for every place and story",
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
    description: "AI agents for every place and story",
    images: ["/images/og-image.jpg"],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#000000',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  
  const content = (
    <html lang="en">
      <body className={inter.className}>
        <TweetInitializer />
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );

  // Only use ClerkProvider if we have a valid key
  if (clerkKey && clerkKey.startsWith('pk_')) {
    return <ClerkProvider publishableKey={clerkKey}>{content}</ClerkProvider>;
  }
  
  return content;
}
