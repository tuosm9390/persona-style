/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi } from 'vitest';
import { POST } from '../analyze/route';
import { createServerSupabaseClient } from '@/lib/supabase/server';

import { NextRequest } from 'next/server';

vi.mock('@/lib/supabase/server');

describe('POST /api/premium/analyze', () => {
  it('should return 401 if unauthorized', async () => {
    vi.mocked(createServerSupabaseClient).mockResolvedValue({
      auth: { 
        getSession: vi.fn().mockResolvedValue({ data: { session: null } }),
        getUser: vi.fn().mockResolvedValue({ data: { user: null } })
      }
    } as any);

    const response = await POST(new NextRequest('http://localhost/api/premium/analyze', {
      method: 'POST',
      body: JSON.stringify({ analysis_id: '550e8400-e29b-41d4-a716-446655440000' })
    }));

    expect(response.status).toBe(401);
  });
});
