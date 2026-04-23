import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Flickup — One podcast. Sixty shorts.",
  description:
    "Drop your hour-long podcast in. Get sixty scroll-stopping vertical clips with captions, tuned per platform.",
  openGraph: {
    title: "Flickup — One podcast. Sixty shorts.",
    description:
      "Drop your hour-long podcast in. Get sixty scroll-stopping vertical clips with captions, tuned per platform.",
    images: [
      {
        url: "https://waitlist-api-sigma.vercel.app/api/og?title=Flickup&accent=emerald&category=Creator%20tools",
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: [
      "https://waitlist-api-sigma.vercel.app/api/og?title=Flickup&accent=emerald&category=Creator%20tools",
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-white text-neutral-900 min-h-screen`}>
        {children}
      </body>
    </html>
  );
}
