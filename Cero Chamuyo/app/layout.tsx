import type React from "react"
import type { Metadata } from "next"
import { Inter, Playfair_Display } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
})

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
})

export const metadata: Metadata = {
  title: "CeroChamuyo — La verdad del vino, en la blockchain",
  description:
    "Reseñas de vinos on-chain auditadas por IA. Inmutabilidad garantizada por Stellar. Sin chamuyo, solo verdad.",
  keywords: [
    "vino",
    "reseñas de vino",
    "blockchain",
    "Stellar",
    "on-chain",
    "Cero Chamuyo",
    "wine reviews",
  ],
  authors: [{ name: "Cero Chamuyo" }],
  creator: "Cero Chamuyo",
  publisher: "Cero Chamuyo",
  metadataBase: new URL("https://cerochamuyo.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "CeroChamuyo — La verdad del vino, en la blockchain",
    description:
      "Reseñas de vinos on-chain auditadas por IA. Inmutabilidad garantizada por Stellar. Sin chamuyo, solo verdad.",
    url: "https://cerochamuyo.com",
    siteName: "Cero Chamuyo",
    locale: "es_CL",
    type: "website",
    images: [
      {
        url: "/favicon.png",
        width: 1024,
        height: 1024,
        alt: "Logo oficial de Cero Chamuyo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CeroChamuyo — La verdad del vino, en la blockchain",
    description:
      "Reseñas de vinos on-chain auditadas por IA. Inmutabilidad garantizada por Stellar.",
    images: ["/favicon.png"],
    creator: "@kl0ren",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", type: "image/x-icon" },
      { url: "/favicon.png", type: "image/png", sizes: "512x512" },
    ],
    shortcut: ["/favicon.ico", "/favicon.png"],
    apple: [{ url: "/favicon.png", type: "image/png" }],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className={`font-sans ${inter.variable} ${playfair.variable} antialiased`}>
        <Suspense fallback={null}>{children}</Suspense>
        <Analytics />
      </body>
    </html>
  )
}
