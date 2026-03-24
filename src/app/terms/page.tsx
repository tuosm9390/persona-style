import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export const metadata = {
  title: "Terms of Service | PersonaStyle",
  description: "Terms of Service for PersonaStyle AI styling service.",
};

export default function TermsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="container flex-1 py-12 px-4 md:px-6 max-w-3xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold tracking-tight">이용약관 (Terms of Service)</h1>
        
        <div className="space-y-6 text-muted-foreground">
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">제 1 조 (목적)</h2>
            <p>본 약관은 PersonaStyle(이하 "서비스")이 제공하는 AI 퍼스널 스타일링 및 관련 제반 서비스의 이용과 관련하여, 회사와 회원 간의 권리, 의무 및 책임사항 등을 규정함을 목적으로 합니다.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">제 2 조 (서비스의 성격 및 한계)</h2>
            <p>1. 본 서비스는 인공지능(AI)을 활용하여 제공되는 자동화된 분석 결과를 제공합니다.<br />
               2. AI 분석 결과는 참고용 정보이며, 100%의 정확성을 보장하지 않습니다. 분석 결과에 따른 사용자의 결정과 행동에 대해 회사는 법적 책임을 지지 않습니다.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">제 3 조 (사용자의 의무)</h2>
            <p>1. 사용자는 타인의 초상권을 침해하는 사진(타인의 얼굴 등)을 무단으로 업로드해서는 안 됩니다.<br />
               2. 불법적이거나 선정적인 이미지를 업로드하는 경우, 시스템에 의해 서비스 이용이 영구적으로 차단될 수 있습니다.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">제 4 조 (서비스의 변경 및 중단)</h2>
            <p>회사는 운영상, 기술상의 필요에 따라 제공하고 있는 전부 또는 일부 서비스를 변경하거나 중단할 수 있으며, 이 경우 사전에 공지합니다.</p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
