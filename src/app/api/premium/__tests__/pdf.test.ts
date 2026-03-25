import { describe, it, expect, vi } from 'vitest';
import { GET } from '../pdf/[id]/route';
import { createServerSupabaseClient } from '@/lib/supabase/server';

vi.mock('@/lib/supabase/server');

describe('GET /api/premium/pdf/[id]', () => {
  it('should return 401 if unauthorized', async () => {
    (createServerSupabaseClient as any).mockResolvedValue({
      auth: { getSession: vi.fn().mockResolvedValue({ data: { session: null } }) }
    });

    const response = await GET(new Request('http://localhost/api/premium/pdf/123'), { params: { id: '123' } });
    expect(response.status).toBe(401);
  });
});
