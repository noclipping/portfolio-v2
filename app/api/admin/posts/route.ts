import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import getSupabaseServer from '@/lib/supabaseServer';
import { deleteFromCloudinary } from '@/lib/cloudinary';

export async function POST(req: NextRequest) {
    const guard = requireAdmin(req);
    if (guard) return guard;

    let body;
    try {
        body = await req.json();
    } catch (err) {
        console.error('JSON parse error:', err);
        return NextResponse.json({ error: 'Invalid JSON in request body' }, { status: 400 });
    }

    console.log('Received body:', JSON.stringify(body, null, 2));

    if (!body.title || !body.slug) {
        return NextResponse.json({
            error: 'Title and slug are required',
            received: { title: body.title, slug: body.slug }
        }, { status: 400 });
    }

    const supabase = getSupabaseServer();

    const insert = {
        title: body.title.trim(),
        slug: body.slug.trim(),
        subtitle: body.subtitle?.trim() || null,
        cover_image_url: body.cover_image_url?.trim() || null,
        body_html: body.body_html || '',
        published: !!body.published,
        published_at: body.published ? (body.published_at || new Date().toISOString()) : null,
    };

    console.log('Inserting:', JSON.stringify(insert, null, 2));

    const { error, data } = await supabase.from('posts').insert(insert).select();
    if (error) {
        console.error('Supabase error:', error);
        return NextResponse.json({
            error: error.message,
            code: error.code,
            details: error.details
        }, { status: 400 });
    }

    console.log('Insert successful:', data);
    return NextResponse.json({ ok: true, data });
}

export async function DELETE(req: NextRequest) {
    const guard = requireAdmin(req);
    if (guard) return guard;

    const { searchParams } = new URL(req.url);
    const postId = searchParams.get('id');

    if (!postId) {
        return NextResponse.json({ error: 'Post ID is required' }, { status: 400 });
    }

    const supabase = getSupabaseServer();

    // First, get the post to find the cover image URL
    const { data: post, error: fetchError } = await supabase
        .from('posts')
        .select('cover_image_url')
        .eq('id', postId)
        .single();

    if (fetchError || !post) {
        console.error('Error fetching post:', fetchError);
        return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    // Delete the Cloudinary image if it exists
    if (post.cover_image_url) {
        try {
            await deleteFromCloudinary(post.cover_image_url);
        } catch (err) {
            console.error('Error deleting Cloudinary image:', err);
            // Continue with post deletion even if image deletion fails
        }
    }

    // Delete the post from Supabase
    const { error: deleteError } = await supabase
        .from('posts')
        .delete()
        .eq('id', postId);

    if (deleteError) {
        console.error('Supabase delete error:', deleteError);
        return NextResponse.json({
            error: deleteError.message,
            code: deleteError.code,
        }, { status: 400 });
    }

    return NextResponse.json({ ok: true });
}

export async function GET(req: NextRequest) {
    const guard = requireAdmin(req);
    if (guard) return guard;

    const supabase = getSupabaseServer();

    const { data, error } = await supabase
        .from('posts')
        .select('id, title, slug, published, published_at')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Supabase error:', error);
        return NextResponse.json({
            error: error.message,
            code: error.code,
        }, { status: 400 });
    }

    return NextResponse.json({ posts: data || [] });
}


