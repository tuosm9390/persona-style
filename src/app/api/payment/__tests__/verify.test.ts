import { POST } from '../verify/route';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';

jest.mock('@supabase/auth-helpers-nextjs');

describe('POST /api/payment/verify', () => {
  it('should return 401 if unauthorized', async () => {
    (createRouteHandlerClient as jest.Mock).mockReturnValue({
      auth: { getSession: jest.fn().mockResolvedValue({ data: { session: null } }) }
    });

    const response = await POST(new Request('http://localhost/api/payment/verify', {
      method: 'POST',
      body: JSON.stringify({ imp_uid: '1', merchant_uid: '2' })
    }));

    expect(response.status).toBe(401);
  });
});
