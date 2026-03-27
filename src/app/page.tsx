import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/features/home/components/HeroSection";
import { FeaturesSection } from "@/features/home/components/FeaturesSection";

/**
 * 메인 홈페이지 (서버 컴포넌트)
 * 정적 구조를 유지하고 상호작용이 필요한 섹션은 클라이언트 컴포넌트로 분리하여 최적화했습니다.
 */
export default function Home() {
  return (
    <div className="flex min-h-screen flex-col selection:bg-accent/30">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <FeaturesSection />
      </main>
      <Footer />
    </div>
  );
}
