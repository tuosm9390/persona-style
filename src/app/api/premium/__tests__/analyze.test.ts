import { POST } from '../analyze/route';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';

jest.mock('@supabase/auth-helpers-nextjs');

describe('POST /api/premium/analyze', () => {
  it('should return 401 if unauthorized', async () => {
    (createRouteHandlerClient as jest.Mock).mockReturnValue({
      auth: { getSession: jest.fn().mockResolvedValue({ data: { session: null } }) }
    });

    const response = await POST(new Request('http://localhost/api/premium/analyze', {
      method: 'POST',
      body: JSON.stringify({ analysis_id: '123' })
    }));

    expect(response.status).toBe(401);
  });
});
