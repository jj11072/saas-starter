import { GET } from './route';
import { NextResponse } from 'next/server';

// Mock the dependencies
jest.mock('@/lib/db/queries', () => ({
  getUser: jest.fn(),
}));

jest.mock('@/lib/db/drizzle', () => ({
  db: {
    select: jest.fn().mockReturnThis(),
    from: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    leftJoin: jest.fn().mockReturnThis(),
    then: jest.fn(),
  },
}));

jest.mock('stripe', () => {
  return jest.fn().mockImplementation(() => ({
    checkout: {
      sessions: {
        create: jest.fn(),
      },
    },
  }));
});

describe('Purchase Route Handler', () => {
  it('should have correct type signature', () => {
    // This test will fail at compile time if the types are wrong
    const handler: typeof GET = async (
      req: Request,
      { params }: { params: { beatId: string } }
    ) => {
      return NextResponse.json({});
    };
  });

  it('should handle invalid beatId', async () => {
    const response = await GET(
      new Request('http://localhost'),
      { params: { beatId: 'not-a-number' } }
    );
    expect(response.status).toBe(400);
  });

  it('should handle unauthorized user', async () => {
    const { getUser } = require('@/lib/db/queries');
    getUser.mockResolvedValue(null);

    const response = await GET(
      new Request('http://localhost'),
      { params: { beatId: '123' } }
    );
    expect(response.status).toBe(401);
  });
}); 