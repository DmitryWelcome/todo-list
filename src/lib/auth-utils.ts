import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function getAuthSession() {
  const session = await getServerSession(authOptions);
  return session as {
    user: {
      id: string;
      email: string;
      name?: string;
    };
  } | null;
}
