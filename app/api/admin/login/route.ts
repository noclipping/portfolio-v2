import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    const contentType = req.headers.get('content-type') || '';
    let password = '';
    if (contentType.includes('application/json')) {
        const body = await req.json();
        password = body.password || '';
    } else {
        const form = await req.formData();
        password = String(form.get('password') || '');
    }

    if (!process.env.ADMIN_PASSWORD || password !== process.env.ADMIN_PASSWORD) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const res = NextResponse.redirect(new URL('/admin', req.url));
    res.cookies.set('admin', '1', {
        httpOnly: true,
        sameSite: 'lax',
        secure: true,
        maxAge: 60 * 60 * 24 * 7,
        path: '/',
    });
    return res;
}


