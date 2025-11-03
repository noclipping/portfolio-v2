import { NextRequest, NextResponse } from 'next/server';
import { isAdminFromRequest } from '@/lib/auth';
import { uploadToCloudinary } from '@/lib/cloudinary';

export async function POST(req: NextRequest) {
    if (!isAdminFromRequest(req)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const form = await req.formData();
    const file = form.get('file');
    if (!(file instanceof File)) {
        return NextResponse.json({ error: 'No file' }, { status: 400 });
    }
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const { url } = await uploadToCloudinary(buffer, file.name);
    return NextResponse.json({ url });
}


