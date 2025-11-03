import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import getSupabaseServer from '@/lib/supabaseServer';

export async function POST(req: NextRequest) {
    const guard = requireAdmin(req);
    if (guard) return guard;

    const body = await req.json();
    const supabase = getSupabaseServer();
    const payload = {
        name: body.name?.trim(),
        link: body.link?.trim() || null,
        icon_url: body.icon_url?.trim() || null,
        blurb: body.blurb?.trim() || null,
        sort_order: body.sort_order ?? 0,
    };

    const { error } = await supabase.from('portfolio').insert(payload);
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ ok: true });
}

export async function PUT(req: NextRequest) {
    const guard = requireAdmin(req);
    if (guard) return guard;

    const body = await req.json();
    if (!body.id) {
        return NextResponse.json({ error: 'ID is required for update' }, { status: 400 });
    }

    const supabase = getSupabaseServer();
    const payload = {
        name: body.name?.trim(),
        link: body.link?.trim() || null,
        icon_url: body.icon_url?.trim() || null,
        blurb: body.blurb?.trim() || null,
        sort_order: body.sort_order ?? 0,
        updated_at: new Date().toISOString(),
    };

    const { error } = await supabase
        .from('portfolio')
        .update(payload)
        .eq('id', body.id);

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
    const guard = requireAdmin(req);
    if (guard) return guard;

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
        return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const supabase = getSupabaseServer();
    const { error } = await supabase
        .from('portfolio')
        .delete()
        .eq('id', id);

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ ok: true });
}

export async function GET(req: NextRequest) {
    const guard = requireAdmin(req);
    if (guard) return guard;

    const supabase = getSupabaseServer();
    const { data, error } = await supabase
        .from('portfolio')
        .select('*')
        .order('sort_order', { ascending: true });

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ portfolio: data || [] });
}
