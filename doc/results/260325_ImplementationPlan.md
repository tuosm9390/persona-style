Date: 2026-03-25 14:40:00
Author: Antigravity

# 🛠️ PersonaStyle Design Transformation Plan

본 계획서는 'persona-style' 프로젝트의 UI를 '일반적인 앱'에서 '프리미엄 패션 분석 서비스'로 진화시키기 위한 단계별 실행 계획입니다.

## 1. 기반 시스템 강화 (Foundational Improvements)
- **[typeset]** Google Fonts `Cormorant` (Serif)와 `Montserrat` (Sans) 도입.
- **[colorize]** `globals.css`의 `oklch` 토큰을 프리미엄 패션 팔레트로 교체 (Deep Charcoal, Soft Gold, Warm White).
- **[normalize]** Tailwind v4의 `@theme` 블록을 정교화하여 일관된 디자인 토큰 시스템 구축.

## 2. 레이아웃 및 심미성 개선 (Aesthetics & Layout)
- **[arrange]** 히어로 섹션의 레이아웃을 'App Store Style'로 변경하여 모바일 목업과 실제 분석 예시를 전면에 배치.
- **[distill]** 불필요한 테두리와 배경 효과를 제거하고 여백(Whitespace)을 활용한 미니멀리즘 강화.
- **[bolder]** 제목 크기와 자간을 조정하여 패션 잡지의 헤드라인과 같은 강력한 타이포그래피 구현.

## 3. 인터랙션 및 애니메이션 (Motion & Interaction)
- **[animate]** Framer Motion을 활용한 스크롤 기반 패럴랙스(Parallax) 배경 및 요소 순차 등장 애니메이션 추가.
- **[polish]** 버튼 호버 시의 미세한 스케일 변화 및 글로우 효과 정밀 조정.
- **[optimize]** 이미지 레이지 로딩 및 폰트 로딩 최적화로 체감 속도 향상.

## 4. 사용자 경험 최적화 (UX Optimization)
- **[onboard]** 분석 페이지(`analyze/page.tsx`)의 모드 선택 인터페이스를 더 직관적이고 감각적인 UI로 개선.
- **[clarify]** 다국어 지원 텍스트의 레이아웃 깨짐 현상 방지를 위한 가변 레이아웃 적용.
- **[harden]** 다양한 기기 크기(375px ~ 2560px)에서의 반응형 대응 강화.

## 5. 실행 로드맵
1. `globals.css` 및 `layout.tsx` 폰트/테마 설정 업데이트.
2. `Header`, `Footer` 공통 컴포넌트 프리미엄 스타일 적용.
3. 메인 히어로 섹션 및 기능 섹션 전면 리뉴얼.
4. 분석 페이지 및 업로드 폼 인터랙션 고도화.
5. 전체 페이지 검수 및 폴리싱.
