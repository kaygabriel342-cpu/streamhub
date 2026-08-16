export type AccountRole = 'admin' | 'user' | 'kids' | 'guest';

export interface AccountProfile {
  id: string;
  name: string;
  email: string;
  role: AccountRole;
  avatar: string;
}

export interface AccountRecord extends AccountProfile {
  password: string;
}

export const demoAccounts: AccountRecord[] = [
  {
    id: 'profile-main',
    name: 'Marquee',
    email: 'you@marquee.com',
    password: 'Marquee@123',
    role: 'user',
    avatar: 'https://api.dicebear.com/9.x/adventurer/svg?seed=Marquee&backgroundColor=b6e3f4',
  },
  {
    id: 'profile-kids',
    name: 'Kids',
    email: 'kids@marquee.com',
    password: 'Kids@123',
    role: 'kids',
    avatar: 'https://api.dicebear.com/9.x/adventurer/svg?seed=Kids&backgroundColor=c0aede',
  },
  {
    id: 'profile-guest',
    name: 'Guest',
    email: 'guest@marquee.com',
    password: 'Guest@123',
    role: 'guest',
    avatar: 'https://api.dicebear.com/9.x/adventurer/svg?seed=Guest&backgroundColor=d1d4f9',
  },
];

export function getAdminAccount(): AccountRecord {
  const email = process.env.ADMIN_EMAIL || 'admin@marquee.com';
  const password = process.env.ADMIN_PASSWORD || 'Kuya@254';

  return {
    id: 'profile-admin',
    name: 'Admin',
    email,
    password,
    role: 'admin',
    avatar: 'https://api.dicebear.com/9.x/adventurer/svg?seed=Admin&backgroundColor=ffdfbf',
  };
}

export function getAllAccounts(): AccountRecord[] {
  const admin = getAdminAccount();
  return admin ? [admin, ...demoAccounts] : demoAccounts;
}

export function sanitizeAccount(account: AccountRecord): AccountProfile {
  const { password: _password, ...profile } = account;
  return profile;
}

export function encodeSession(profile: AccountProfile): string {
  return Buffer.from(JSON.stringify(profile)).toString('base64url');
}

export function decodeSession(value?: string): AccountProfile | null {
  if (!value) return null;
  try {
    return JSON.parse(Buffer.from(value, 'base64url').toString('utf8')) as AccountProfile;
  } catch {
    return null;
  }
}
