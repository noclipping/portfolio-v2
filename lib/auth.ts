import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export function isAdminFromRequest(req: NextRequest): boolean {
    const cookie = req.cookies.get('admin');
    return cookie?.value === '1';
}

export function isAdminFromCookies(): boolean {
    const store = cookies();
    const c = store.get('admin');
    return c?.value === '1';
}

export function requireAdmin(req: NextRequest): NextResponse | null {
    if (!isAdminFromRequest(req)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return null;
}


