import { GET } from '../[id]/route';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';

jest.mock('@supabase/auth-helpers-nextjs');

describe('GET /api/share/[id]', () => {
  it('should return 404 if analysis does not exist', async () => {
    const mockSupabase = {
      from: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({ data: null, error: null }),
    };
    (createRouteHandlerClient as jest.Mock).mockReturnValue(mockSupabase);

    const response = await GET(new Request('http://localhost/api/share/123'), { params: { id: '123' } });
    expect(response.status).toBe(404);
  });
});
