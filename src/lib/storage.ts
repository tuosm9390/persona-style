export function getShareImageUrl(analysisId: string): string {
  // 실제 구현에서는 Supabase Storage URL 또는 API Route URL을 반환
  // 여기서는 API Route를 통한 동적 생성 URL을 기본으로 함
  return `${process.env.NEXT_PUBLIC_SITE_URL || ""}/api/share/${analysisId}`;
}

export async function uploadGeneratedImage(
  analysisId: string,
  imageBuffer: Buffer,
) {
  // TODO: Supabase Storage에 이미지를 영구 저장하는 로직 (필요 시)
  // 현재는 Satori를 이용한 실시간 동적 생성을 우선함
}
