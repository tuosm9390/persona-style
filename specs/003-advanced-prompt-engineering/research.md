# Research: 고도화된 이미지 분석 프롬프트 엔지니어링

**Feature**: 고도화된 이미지 분석 프롬프트 엔지니어링 (003-advanced-prompt-engineering)
**Date**: 2026-03-25

## 개요
이미지 분석의 일관성을 확보하고 시각적 요소를 정밀하게 분해하여 JSON으로 구조화하기 위한 프롬프트 전략을 연구합니다.

## 연구 항목 1: 퍼스널 컬러 분석의 일관성 확보
### 결정
프롬프트 내에 **시각적 기준 척도(Visual Reference Scale)**를 포함하고, 분석 전 '이미지 정규화(Normalization)' 단계를 명시적으로 지시합니다.

### 근거
- AI 모델은 주변 조명이나 배경색에 따라 색상 인식이 달라질 수 있습니다.
- 프롬프트에 "먼저 흰색 배경이나 피부 노출 부위의 밝기를 기준으로 조명 상태를 정규화한 뒤, 표준 스킨톤 차트(Fitzpatrick Scale 등)를 참조하여 분석하라"는 지침을 추가하면 결과의 편차를 크게 줄일 수 있습니다.

### 고려된 대안
- 이미지 전처리를 통한 자동 보정: 서버 부하와 처리 시간(3초 제약) 증가 우려로 배제.

## 연구 항목 2: 정밀한 시각 요소 분해 (Visual Component Decomposition)
### 결정
**'위상 분석(Topological Analysis)'** 기법을 프롬프트에 적용하여 머리부터 발끝까지 계층적으로 분석하도록 유도합니다.

### 상세 항목
1. **Hair**: `style` (length, curl), `color` (base, highlight)
2. **Face**: `shape` (oval, square, etc.), `tone` (brightness, undertone)
3. **Body**: `type` (height, shoulder width proportion), `posture` (open, closed, leaning)
4. **Apparel**: `category` (top, bottom, outer), `fit` (oversized, slim), `main_color`

### 근거
- 항목을 구체적으로 나열하고 각 항목에 대한 가능한 선택지(Enum 스타일)를 프롬프트에 제공함으로써 AI의 임의적인 묘사를 제한하고 데이터 구조화의 정확도를 높입니다.

## 연구 항목 3: JSON 출력 안정성 및 Zod 검증
### 결정
Gemini 1.5 Pro의 **'JSON Mode'** 또는 **'Response Schema'** 기능을 활성화하고, API 수신 단에서 `Zod`를 통한 강격한 스키마 검증을 수행합니다.

### 근거
- Zod 스키마를 통해 필수 필드 누락이나 잘못된 데이터 타입을 런타임에 즉시 차단합니다.
- 실패 시 재시도 로직보다는 즉각적인 원인 분석(Constitution 3-Strike Rule 연계)을 우선합니다.

## 요약
- **분석 논리**: 정규화 -> 위상 분석 -> JSON 추출
- **핵심 기술**: Gemini System Instruction, Zod Schema Validation
- **성능**: 단일 요청으로 모든 요소 추출하여 3초 이내 응답 보장
