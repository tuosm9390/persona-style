import '@testing-library/jest-dom';
import { vi } from 'vitest';

// 필요한 경우 전역 mock 설정
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '',
}));
