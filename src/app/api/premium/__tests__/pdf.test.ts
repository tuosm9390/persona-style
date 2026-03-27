/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi } from 'vitest';
import { GET } from '../pdf/[id]/route';
import { createServerSupabaseClient } from '@/lib/supabase/server';

import { NextRequest } from 'next/server';

vi.mock('@/lib/supabase/server');

describe('GET /api/premium/pdf/[id]', () => {
  it('should return 401 if unauthorized', async () => {
    vi.mocked(createServerSupabaseClient).mockResolvedValue({
      auth: { 
        getSession: vi.fn().mockResolvedValue({ data: { session: null } }),
        getUser: vi.fn().mockResolvedValue({ data: { user: null } })
      }
    } as any);

    const response = await GET(new NextRequest('http://localhost/api/premium/pdf/123'), { params: Promise.resolve({ id: '123' }) });
    expect(response.status).toBe(401);
  });
});
