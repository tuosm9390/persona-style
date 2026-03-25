# Feature Specification: 고도화된 이미지 분석 프롬프트 엔지니어링 (Advanced Image Analysis Prompt Engineering)

**Feature Branch**: `003-advanced-prompt-engineering`  
**Created**: 2026-03-25  
**Status**: Draft  
**Input**: User description: "현재 분석에 사용되고 있는 프롬프트를 고도화해줘. 테스트로 사진을 하나 첨부하고 분석요청했을 때 매번 퍼스널컬러가 바뀌는 것 같아. 같은 이미지를 첨부했을 때는 최대한 비슷한 내용의 분석이 출력될 수 있도록 매우 세분화했으면 좋겠어. 사진을 분석할 때는 각 값들을 모두 분해하고 나열해서 json을 통해 분석에 사용해줘. 예를 들면 머리스타일, 머리색상, 얼굴형태, 얼굴색, 피부색, 체형, 자세, 옷 등등 사진을 보고 분해할 수 있는 모든 내용을 작성하면 좋겠어."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - 일관된 퍼스널 컬러 분석 (Priority: P1)

사용자가 동일한 사진을 여러 번 업로드하여 분석을 요청했을 때, 퍼스널 컬러 결과가 매번 바뀌지 않고 일관되게 출력되어야 합니다.

**Why this priority**: 퍼스널 컬러는 서비스의 신뢰도를 결정하는 핵심 요소이며, 결과의 가변성은 사용자 경험을 크게 저하시킵니다.

**Independent Test**: 동일한 고해상도 인물 사진을 10회 연속 분석 요청했을 때, 퍼스널 컬러 결과(웜/쿨, 계절 등)가 90% 이상의 일치율을 보이는지 확인합니다.

**Acceptance Scenarios**:

1. **Given** 동일한 인물 사진 파일이 준비됨, **When** 10회 분석을 실행함, **Then** 9회 이상 동일한 퍼스널 컬러 진단 결과가 도출됨.
2. **Given** 조명 조건이 유사한 다른 사진 두 장이 준비됨, **When** 각각 분석을 실행함, **Then** 분석된 피부색(RGB/Hex 추정치)과 톤 진단 결과가 유사한 범위 내에 있음.

---

### User Story 2 - 시각적 요소의 정밀 분해 및 구조화 (Priority: P2)

사진 속 인물의 다양한 시각적 특징(헤어, 얼굴, 피부, 체형, 자세, 의상 등)을 세부 항목으로 분해하여 JSON 형식으로 추출합니다.

**Why this priority**: 정밀한 요소 분해는 사용자에게 더 구체적인 스타일 제안을 가능하게 하며, 데이터 기반의 페르소나 매칭을 위한 기초 자료가 됩니다.

**Independent Test**: 분석 결과 JSON에 사전에 정의된 필수 시각 요소(머리스타일, 머리색상, 얼굴형태, 얼굴색, 피부색, 체형, 자세, 옷)가 모두 포함되어 있는지 확인합니다.

**Acceptance Scenarios**:

1. **Given** 전신 인물 사진이 업로드됨, **When** 프롬프트 분석이 완료됨, **Then** 결과값이 지정된 JSON 스키마를 준수하며 모든 필수 필드가 누락 없이 작성됨.
2. **Given** 복잡한 배경의 사진이 업로드됨, **When** 분석을 실행함, **Then** 인물 이외의 노이즈를 배제하고 인물의 시각적 특징만을 정확히 분해함.

---

### User Story 3 - 세분화된 분석 데이터를 통한 인사이트 제공 (Priority: P3)

분해된 JSON 데이터를 활용하여 사용자에게 기존보다 더 깊이 있는 스타일 및 퍼스널 브랜딩 제안을 생성합니다.

**Why this priority**: 단순한 결과 통보를 넘어 전문적인 컨설팅 수준의 인사이트를 제공하여 서비스의 프리미엄 가치를 높입니다.

**Independent Test**: 생성된 리포트가 JSON에 포함된 모든 세부 요소(체형, 자세 등)를 언급하며 통합적인 스타일링 조언을 포함하는지 확인합니다.

**Acceptance Scenarios**:

1. **Given** 정밀 분석된 JSON 데이터가 존재함, **When** 최종 리포트를 생성함, **Then** 사용자의 체형과 자세에 적합한 의상 핏(Fit) 제안이 포함됨.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-PRM-001**: 인공지능 프롬프트는 시각적 요소를 '식별-분석-추출'하는 3단계 논리 구조를 가져야 합니다.
- **FR-PRM-002**: 동일 이미지에 대한 분석 편차를 최소화하기 위해 분석 기준(Refrence Scale)을 프롬프트 내에 명시적으로 정의해야 합니다.
- **FR-RET-001**: 분석 결과는 반드시 유효한 JSON 형식으로 출력되어야 하며, 다음 필드를 필수로 포함해야 합니다: `hair_style`, `hair_color`, `face_shape`, `face_color`, `skin_tone`, `body_type`, `posture`, `apparel`.
- **FR-RET-002**: 피부색 분석 시 주관적 묘사 대신 보편적인 스킨톤 가이드(예: Fitzpatrick scale 또는 RGB 근사치)를 참조하여 분석 일관성을 확보해야 합니다.
- **FR-SEC-001**: 시스템은 Zod를 사용하여 API 경계에서 추출된 JSON 데이터의 유효성을 검증해야 합니다.
- **FR-HIS-001**: 분석된 `VisualAnalysisProfile` 데이터는 사용자의 분석 히스토리에 포함되어 시계열적으로 저장되어야 합니다.
- **FR-COM-001**: 커뮤니티 공유 요청 시, 프로필 데이터 중 개인을 식별할 수 있는 메타데이터를 제거하고 익명화된 상태로만 외부 노출을 허용해야 합니다.
- **FR-VIS-001**: 시각적 요소 분석 및 JSON 추출 프로세스는 사용자 요청 후 3초 이내에 완료되어야 합니다. (Constitution 준수)

### Key Entities *(include if feature involves data)*

- **VisualAnalysisProfile**: 사진에서 추출된 모든 시각적 특징을 담은 핵심 엔티티.
- **PromptTemplate**: 일관성을 보장하기 위해 구조화된 고도화 프롬프트 템플릿.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 동일 이미지 10회 분석 시 퍼스널 컬러 일치율 90% 이상 달성.
- **SC-002**: 분석 결과 JSON의 스키마 준수율 및 필수 필드 포함률 100% 달성.
- **SC-003**: 시각 요소 분해 항목 수 기존 대비 2배 이상 증가 (최소 10개 이상의 유의미한 시각 속성 추출).
- **SC-004**: 프롬프트 실행부터 결과 반환까지의 평균 소요 시간 3초 이내 유지.
