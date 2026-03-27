import { describe, it, expect, vi } from 'vitest';
import { GET } from '../[id]/route';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { NextRequest } from 'next/server';

vi.mock('@/lib/supabase/server');

describe('GET /api/share/[id]', () => {
  it('should return 404 if analysis does not exist', async () => {
    const mockSupabase = {
      from: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: null, error: null }),
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.mocked(createServerSupabaseClient).mockResolvedValue(mockSupabase as any);

    const response = await GET(new NextRequest('http://localhost/api/share/123'), { params: Promise.resolve({ id: '123' }) });
    expect(response.status).toBe(404);
  });
});
