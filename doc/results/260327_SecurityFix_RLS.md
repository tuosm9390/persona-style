Date: 2026-03-27 11:10:00
Author: Antigravity

# 🛡️ Supabase RLS 보안 패치 가이드

프로젝트 전체 리뷰 결과, 결제 완료 후의 데이터 업데이트 및 프리미엄 리포트 생성 과정에서 권한 오류(RLS 위반)가 발생할 수 있는 취약점이 발견되었습니다. 이를 해결하기 위해 아래 SQL 쿼리를 Supabase SQL Editor에서 실행해주시기 바랍니다.

## 1. 결제 트랜잭션 업데이트 권한 허용
사용자가 결제 완료 후 자신의 결제 상태를 `paid`로 갱신할 수 있도록 합니다.

```sql
-- 기존 SELECT 정책은 유지하고 UPDATE 정책을 추가합니다.
CREATE POLICY "Users can update their own transactions" 
ON payment_transactions FOR UPDATE 
USING (auth.uid() = user_id);
```

## 2. 프리미엄 리포트 생성 권한 허용
분석 완료 후 프리미엄 리포트 데이터를 테이블에 삽입할 수 있도록 합니다.

```sql
-- 리포트 삽입 권한 추가
CREATE POLICY "Users can insert their own premium reports" 
ON premium_reports FOR INSERT 
WITH CHECK (auth.uid() = user_id);
```

## 3. 적용 확인 방법
SQL 실행 후, 아래 명령어를 통해 정책이 정상적으로 생성되었는지 확인할 수 있습니다.

```sql
SELECT * FROM pg_policies 
WHERE tablename IN ('payment_transactions', 'premium_reports');
```

## 주의 사항
- 이 작업은 데이터베이스의 보안 모델을 변경하므로, 실제 운영 환경에 적용하기 전에 스테이징 환경에서 테스트하는 것을 권장합니다.
- `auth.uid() = user_id` 조건이 정확히 설정되어 있는지 확인하십시오.

---
**Antigravity**
*Senior Developer*
