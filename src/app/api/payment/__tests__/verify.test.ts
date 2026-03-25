import { describe, it, expect, vi } from 'vitest';
import { POST } from '../verify/route';
import { createServerSupabaseClient } from '@/lib/supabase/server';

vi.mock('@/lib/supabase/server');

describe('POST /api/payment/verify', () => {
  it('should return 401 if unauthorized', async () => {
    (createServerSupabaseClient as any).mockResolvedValue({
      auth: { getSession: vi.fn().mockResolvedValue({ data: { session: null } }) }
    });

    const response = await POST(new Request('http://localhost/api/payment/verify', {
      method: 'POST',
      body: JSON.stringify({ imp_uid: '1', merchant_uid: '2' })
    }));

    expect(response.status).toBe(401);
  });
});
