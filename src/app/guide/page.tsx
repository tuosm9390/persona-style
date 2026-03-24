import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Palette, Shirt, Sparkles } from "lucide-react";

export const metadata = {
  title: "Style Guide | PersonaStyle",
  description: "Learn about personal color seasons, body types, and how to find your best style.",
};

export default function GuidePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="container flex-1 py-12 px-4 md:px-6 max-w-5xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold bg-primary/10 text-primary">
            <Sparkles className="mr-1.5 h-3 w-3" />
            PersonaStyle Knowledge Base
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight">퍼스널 스타일 & 컬러 가이드</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            나에게 가장 잘 어울리는 색상과 핏을 찾아가는 여정. AI가 분석하는 핵심 요소들을 미리 알아보세요.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Personal Color */}
          <Card className="border-primary/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Palette className="h-6 w-6 text-primary" />
                퍼스널 컬러 (Personal Color)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-muted-foreground">
                피부톤, 눈동자, 머리카락 색상 등 개인이 가진 고유의 색과 가장 조화롭게 어우러지는 컬러 팔레트입니다. 크게 4계절(봄, 여름, 가을, 겨울)로 나뉩니다.
              </p>
              
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-green-50/50 border border-green-100">
                  <h3 className="font-bold text-green-700 mb-1">🌸 봄 웜톤 (Spring Warm)</h3>
                  <p className="text-sm text-muted-foreground">명도와 채도가 높고 따뜻한 옐로우 베이스. 코랄, 피치, 카멜 색상이 잘 어울립니다. 밝고 생기있는 에너지가 특징입니다.</p>
                </div>
                <div className="p-4 rounded-lg bg-blue-50/50 border border-blue-100">
                  <h3 className="font-bold text-blue-700 mb-1">🌊 여름 쿨톤 (Summer Cool)</h3>
                  <p className="text-sm text-muted-foreground">흰색과 파란색이 섞인 듯한 차가운 베이스. 파스텔 핑크, 라벤더, 스카이 블루가 베스트입니다. 청순하고 우아한 이미지를 줍니다.</p>
                </div>
                <div className="p-4 rounded-lg bg-orange-50/50 border border-orange-100">
                  <h3 className="font-bold text-orange-700 mb-1">🍂 가일 웜톤 (Autumn Warm)</h3>
                  <p className="text-sm text-muted-foreground">차분하고 깊이 있는 따뜻한 색감. 브릭 레드, 머스타드, 올리브 그린이 찰떡입니다. 성숙하고 고급스러운 분위기가 돋보입니다.</p>
                </div>
                <div className="p-4 rounded-lg bg-slate-50/50 border border-slate-200">
                  <h3 className="font-bold text-slate-700 mb-1">❄️ 겨울 쿨톤 (Winter Cool)</h3>
                  <p className="text-sm text-muted-foreground">강렬하고 선명한 차가운 색감. 블랙, 화이트, 버건디, 딥 네이비 등 대비가 뚜렷한 색이 어울리며 시크하고 도시적인 느낌을 줍니다.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Body Types */}
          <Card className="border-primary/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Shirt className="h-6 w-6 text-primary" />
                체형 분석 (Body Types)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-muted-foreground">
                신체의 비율과 굴곡에 따라 최적의 핏을 찾는 방법입니다. 자신의 체형을 알면 장점을 부각하고 단점을 보완하는 실루엣을 고를 수 있습니다.
              </p>

              <div className="space-y-4">
                <div className="space-y-2">
                  <h3 className="font-bold border-b pb-1">⌛ 모래시계형 (Hourglass)</h3>
                  <p className="text-sm text-muted-foreground">어깨와 골반 너비가 비슷하고 허리가 잘록한 체형. 허리선을 강조하는 랩 드레스나 크롭 탑, 하이웨이스트 바지가 장점을 극대화합니다.</p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-bold border-b pb-1">📐 직사각형 (Rectangle)</h3>
                  <p className="text-sm text-muted-foreground">어깨, 허리, 골반의 너비가 비슷한 슬림한 체형. 볼륨감을 주는 러플 블라우스나 페플럼 스커트, 혹은 시크하게 일자로 떨어지는 오버핏 매니시 룩이 어울립니다.</p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-bold border-b pb-1">🔺 삼각형 / 서양배형 (Pear)</h3>
                  <p className="text-sm text-muted-foreground">상체보다 하체가 발달한 체형. 상체에 밝은 색이나 화려한 패턴을 주어 시선을 위로 끌어올리고, 하체는 어두운 색의 A라인 치마나 와이드 팬츠로 커버하는 것이 좋습니다.</p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-bold border-b pb-1">🔻 역삼각형 (Inverted Triangle)</h3>
                  <p className="text-sm text-muted-foreground">하체에 비해 어깨가 발달한 체형. 깊은 V넥이나 U넥으로 어깨선을 분산시키고, 하체에는 플레어 스커트나 밝은 색상의 바지로 볼륨감을 주는 코디를 추천합니다.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
