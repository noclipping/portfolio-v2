import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
});

export async function uploadToCloudinary(buffer: Buffer, filename?: string) {
    return await new Promise<{ url: string }>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { folder: 'blog', public_id: filename?.split('.')[0] },
            (error, result) => {
                if (error || !result) return reject(error);
                resolve({ url: result.secure_url });
            }
        );
        stream.end(buffer);
    });
}

/**
 * Delete an image from Cloudinary given its URL
 * Extracts the public_id from the URL and deletes it
 */
export async function deleteFromCloudinary(imageUrl: string): Promise<void> {
    if (!imageUrl || !imageUrl.includes('cloudinary.com')) {
        console.log('Not a Cloudinary URL, skipping deletion:', imageUrl);
        return;
    }

    // Extract public_id from Cloudinary URL
    // Format: https://res.cloudinary.com/{cloud_name}/image/upload/{version}/{folder}/{public_id}.{ext}
    const urlParts = imageUrl.split('/');
    const uploadIndex = urlParts.findIndex(part => part === 'upload');

    if (uploadIndex === -1 || uploadIndex >= urlParts.length - 1) {
        console.error('Could not parse Cloudinary URL:', imageUrl);
        return;
    }

    // After 'upload', we have: [version, folder, filename]
    // We want: folder/filename (without extension)
    const pathParts = urlParts.slice(uploadIndex + 1);
    const filename = pathParts[pathParts.length - 1];
    const folder = pathParts.length > 1 ? pathParts[pathParts.length - 2] : null;

    // Remove file extension
    const publicId = filename.split('.')[0];
    const fullPublicId = folder ? `${folder}/${publicId}` : publicId;

    return await new Promise<void>((resolve, reject) => {
        cloudinary.uploader.destroy(fullPublicId, (error, result) => {
            if (error) {
                console.error('Cloudinary delete error:', error);
                return reject(error);
            }
            console.log('Deleted Cloudinary image:', fullPublicId, result);
            resolve();
        });
    });
}


