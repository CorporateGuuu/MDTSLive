import { UserRole } from '../types';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string;
      role: UserRole;
      wholesaleApproved: boolean;
    };
  }

  interface User {
    role: UserRole;
    wholesaleApproved: boolean;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role: UserRole;
    wholesaleApproved: boolean;
  }
}
