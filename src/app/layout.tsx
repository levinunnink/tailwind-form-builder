import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { Geist, Geist_Mono, Slackey } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const slackey = Slackey({
  variable: "--font-slackey",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Tailwind Form Builder - Free Visual Form Builder for Tailwind CSS",
  description: "Free Tailwind Form Builder to create beautiful forms visually. Drag and drop fields, customize styles, and export to HTML, React, or Vue. No login required.",
  keywords: ["Tailwind Form Builder", "Tailwind CSS form", "form builder", "React form generator", "Vue form builder", "HTML form builder", "drag and drop form builder", "Tailwind forms"],
  authors: [{ name: "Levi Nunnink" }],
  creator: "Levi Nunnink",
  icons: {
    icon: "/info.png",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    title: "Tailwind Form Builder - Free Visual Form Builder for Tailwind CSS",
    description: "Create beautiful Tailwind CSS forms visually. Drag and drop fields, customize themes, and export clean code for HTML, React, or Vue.",
    siteName: "Tailwind Form Builder",
    images: ["/card.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tailwind Form Builder - Free Visual Form Builder",
    description: "Create beautiful Tailwind CSS forms visually. Export to HTML, React, or Vue. No login required.",
    images: ["/card.png"],
  },
  robots: {
    index: true,
    follow: true,
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
        className={`${geistSans.variable} ${geistMono.variable} ${slackey.variable} antialiased`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
