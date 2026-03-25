import type { Metadata } from "next";
import { Cormorant, Montserrat } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "@/components/ui/sonner";
import Script from "next/script";

const montserrat = Montserrat({
  variable: "--font-sans",
  subsets: ["latin"],
});

const cormorant = Cormorant({
  variable: "--font-display",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://personastyle.vercel.app"),
  title: {
    default: "PersonaStyle - AI Personal Style & Color Analysis",
    template: "%s | PersonaStyle",
  },
  description: "AI 기반 퍼스널 컬러 및 스타일 분석 서비스. 당신에게 가장 잘 어울리는 색상과 패션 스타일을 AI가 제안합니다.",
  keywords: ["AI 퍼스널컬러", "스타일 분석", "AI 패션", "퍼스널 스타일링", "Personal Color Analysis", "AI Style Guide"],
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: "https://personastyle.vercel.app",
    title: "PersonaStyle - AI 퍼스널 스타일 & 컬러 분석",
    description: "사진 한 장으로 확인하는 나만의 퍼스널 스타일. AI가 제안하는 완벽한 룩을 만나보세요.",
    siteName: "PersonaStyle",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "PersonaStyle - AI Styling",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PersonaStyle - AI 퍼스널 스타일 & 컬러 분석",
    description: "당신에게 가장 잘 어울리는 스타일, AI가 찾아드립니다.",
    images: ["/og-image.png"],
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
        className={cn(
          "min-h-screen bg-background font-sans antialiased break-keep",
          montserrat.variable,
          cormorant.variable
        )}
      >
        <AuthProvider>
          <LanguageProvider>
            {children}
            <Toaster />
          </LanguageProvider>
        </AuthProvider>
        <Script src="https://cdn.iamport.kr/v1/iamport.js" />
      </body>
    </html>
  );
}
