import { describe, it, expect, vi } from 'vitest';
import { POST } from '../analyze/route';
import { createServerSupabaseClient } from '@/lib/supabase/server';

vi.mock('@/lib/supabase/server');

describe('POST /api/premium/analyze', () => {
  it('should return 401 if unauthorized', async () => {
    (createServerSupabaseClient as any).mockResolvedValue({
      auth: { getSession: vi.fn().mockResolvedValue({ data: { session: null } }) }
    });

    const response = await POST(new Request('http://localhost/api/premium/analyze', {
      method: 'POST',
      body: JSON.stringify({ analysis_id: '123' })
    }));

    expect(response.status).toBe(401);
  });
});
