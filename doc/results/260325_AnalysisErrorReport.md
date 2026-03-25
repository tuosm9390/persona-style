Date: 2026-03-25 15:00:00
Author: Antigravity

# ⚠️ Google 로그인 오류 분석 및 해결 가이드

사용자로부터 보고된 `Unsupported provider: missing OAuth secret` 에러에 대한 분석 결과와 해결 방법을 정리한 보고서입니다.

---

## 1. 현상 분석 (Problem Analysis)

- **에러 메시지**: `{"code":400,"error_code":"validation_failed","msg":"Unsupported provider: missing OAuth secret"}`
- **발생 지점**: `src/app/login/page.tsx`의 `handleSocialLogin('google')` 호출 시 발생.
- **상태**: Supabase 인증 서버(GoTrue)에서 클라이언트 요청을 받았으나, 서버에 설정된 Google OAuth 인증 정보가 불완전하여 요청을 거절함.

---

## 2. 원인 진단 (Root Cause)

이 에러는 **Supabase 프로젝트 대시보드에 Google OAuth Client Secret이 설정되지 않았을 때** 발생하는 전형적인 에러입니다.

- 코드(`signInWithOAuth`)는 정상적으로 작성되어 있으나, Supabase 클라우드 서버 측에 저장된 인증 "비밀키(Secret)"가 누락되었습니다.
- Google Cloud Console에서 Client ID만 복사하고 Client Secret을 누락했거나, 저장 버튼을 누르지 않았을 가능성이 높습니다.

---

## 3. 해결 방법 (Action Items)

### Step 1: Supabase 대시보드 설정 업데이트

1. [Supabase Dashboard](https://supabase.com/dashboard)에 로그인합니다.
2. 해당 프로젝트의 **Authentication** > **Providers** 메뉴로 이동합니다.
3. **Google** 항목을 찾아 확장합니다.
4. **Client Secret** 필드가 비어 있는지 확인하고, Google Cloud Console에서 발급받은 값을 입력합니다.
5. `Save` 버튼을 눌러 설정을 저장합니다.

### Step 2: Google Cloud Console 확인

1. [Google Cloud Console](https://console.cloud.google.com/)의 **API 및 서비스 > 사용자 인증 정보**로 이동합니다.
2. 사용 중인 OAuth 2.0 클라이언트 ID를 클릭합니다.
3. **승인된 리디렉션 URI**에 다음 주소가 등록되어 있는지 확인합니다.
   - `https://[your-project-id].supabase.co/auth/v1/callback`
   - (로컬 테스트용이 아닌 Supabase 프로젝트 URL 기준 주소여야 합니다.)

---

## 4. 향후 개선 사항 (Improvements)

현재 `src/app/login/page.tsx`에서 에러 발생 시 Supabase가 전달하는 메시지를 그대로 노출하고 있습니다. 이를 다음과 같이 더 친절하게 개선하는 작업을 수행할 수 있습니다.

```typescript
// src/app/login/page.tsx (개선 예시)
try {
  // ... login logic
} catch (error: any) {
  if (error.message.includes("missing OAuth secret")) {
    toast.error(
      "Google 로그인 설정이 완료되지 않았습니다. 관리자에게 문의하세요.",
    );
  } else {
    toast.error(error.message || "로그인 중 오류가 발생했습니다.");
  }
}
```

---

**보고된 에러는 설정 이슈로 확인되었으므로, 위 가이드에 따라 Supabase 설정을 업데이트해 주시기 바랍니다.**
