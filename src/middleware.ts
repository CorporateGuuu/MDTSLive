import { NextResponse } from 'next/server';

export function middleware() {
  return NextResponse.next();
}

// THIS IS THE KEY LINE — disables static rendering for the whole site
export const config = {
  matcher: '/((?!_next/static|_next/image|favicon.ico).*)',
};
