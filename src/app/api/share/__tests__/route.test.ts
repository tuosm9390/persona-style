import { describe, it, expect, vi } from 'vitest';
import { GET } from '../[id]/route';
import { createServerSupabaseClient } from '@/lib/supabase/server';

vi.mock('@/lib/supabase/server');

describe('GET /api/share/[id]', () => {
  it('should return 404 if analysis does not exist', async () => {
    const mockSupabase = {
      from: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: null, error: null }),
    };
    (createServerSupabaseClient as any).mockResolvedValue(mockSupabase);

    const response = await GET(new Request('http://localhost/api/share/123'), { params: { id: '123' } });
    expect(response.status).toBe(404);
  });
});
