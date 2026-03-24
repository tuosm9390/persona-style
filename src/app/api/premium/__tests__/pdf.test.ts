import { GET } from '../pdf/[id]/route';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';

jest.mock('@supabase/auth-helpers-nextjs');

describe('GET /api/premium/pdf/[id]', () => {
  it('should return 401 if unauthorized', async () => {
    (createRouteHandlerClient as jest.Mock).mockReturnValue({
      auth: { getSession: jest.fn().mockResolvedValue({ data: { session: null } }) }
    });

    const response = await GET(new Request('http://localhost/api/premium/pdf/123'), { params: { id: '123' } });
    expect(response.status).toBe(401);
  });
});
