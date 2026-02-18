import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-display",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  title: {
    default: "PersonaStyle - AI Personal Styling",
    template: "%s | PersonaStyle",
  },
  description: "Discover your best look with AI-powered personal styling and color analysis.",
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: "/",
    title: "PersonaStyle - AI 퍼스널 스타일링",
    description: "AI가 분석해주는 나만의 퍼스널 컬러와 스타일. 지금 바로 확인해보세요.",
    siteName: "PersonaStyle",
  },
  twitter: {
    card: "summary_large_image",
    title: "PersonaStyle - AI 퍼스널 스타일링",
    description: "AI가 분석해주는 나만의 퍼스널 컬러와 스타일.",
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
        className={cn(
          "min-h-screen bg-background font-sans antialiased break-keep",
          inter.variable,
          outfit.variable
        )}
      >
        <LanguageProvider>
          {children}
          <Toaster />
        </LanguageProvider>
      </body>
    </html>
  );
}
