import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export const metadata = {
  title: "Privacy Policy | PersonaStyle",
  description: "Privacy Policy for PersonaStyle AI styling service.",
};

export default function PrivacyPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="container flex-1 py-12 px-4 md:px-6 max-w-3xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold tracking-tight">개인정보 처리방침 (Privacy Policy)</h1>
        
        <div className="space-y-6 text-muted-foreground">
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">1. 수집하는 개인정보의 항목</h2>
            <p>PersonaStyle은 AI 스타일 분석을 위해 사용자가 자발적으로 업로드하는 <strong>사진 이미지 및 텍스트 데이터</strong>를 일시적으로 처리합니다. 로그인을 진행할 경우 이메일 주소 및 프로필 정보가 수집될 수 있습니다.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">2. 개인정보의 처리 목적</h2>
            <p>수집된 이미지는 AI 파운데이션 모델(Google Gemini)을 통한 퍼스널 컬러, 체형 분석 및 스타일링 결과 제공의 목적으로만 1회성으로 사용됩니다. <strong>사용자의 얼굴 사진이나 입력 텍스트는 AI 학습용으로 저장되거나 제3자에게 판매되지 않습니다.</strong></p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">3. 개인정보의 보유 및 이용 기간</h2>
            <p>비로그인 사용자의 분석 결과는 사용자의 브라우저 로컬 저장소(Local Storage)에만 보관됩니다. 로그인 사용자의 경우 서비스 탈퇴 시까지 클라우드(Supabase)에 보관되며, 탈퇴 시 즉시 영구 삭제됩니다.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">4. 동의 거부권</h2>
            <p>사용자는 사진 업로드를 거부할 권리가 있으며, 텍스트 입력만으로도 서비스를 이용할 수 있습니다. 단, 사진 미제공 시 시각적 분석(체형/얼굴형 등)의 정확도가 제한될 수 있습니다.</p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
