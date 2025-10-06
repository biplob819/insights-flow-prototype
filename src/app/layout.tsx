import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Insights Flow - Dashboard Analytics",
    template: "%s | Insights Flow"
  },
  description: "Create and manage your business dashboards with Insights Flow",
  keywords: ["dashboard", "analytics", "business intelligence", "data visualization"],
  authors: [{ name: "Insights Flow Team" }],
  creator: "Insights Flow",
  publisher: "Insights Flow",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://insights-flow.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_APP_URL || 'https://insights-flow.com',
    title: 'Insights Flow - Dashboard Analytics',
    description: 'Create and manage your business dashboards with Insights Flow',
    siteName: 'Insights Flow',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Insights Flow - Dashboard Analytics',
    description: 'Create and manage your business dashboards with Insights Flow',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
