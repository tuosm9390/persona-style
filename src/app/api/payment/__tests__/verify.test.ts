/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi } from 'vitest';
import { POST } from '../verify/route';
import { createServerSupabaseClient } from '@/lib/supabase/server';

import { NextRequest } from 'next/server';

vi.mock('@/lib/supabase/server');

describe('POST /api/payment/verify', () => {
  it('should return 401 if unauthorized', async () => {
    vi.mocked(createServerSupabaseClient).mockResolvedValue({
      auth: { getSession: vi.fn().mockResolvedValue({ data: { session: null } }) }
    } as any);

    const response = await POST(new NextRequest('http://localhost/api/payment/verify', {
      method: 'POST',
      body: JSON.stringify({ imp_uid: '1', merchant_uid: '2' })
    }));

    expect(response.status).toBe(401);
  });
});
