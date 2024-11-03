import { revalidatePath } from 'next/cache'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const auth = request.nextUrl.searchParams.get('auth')

    if (auth !== process.env.CACHE_INVALIDATE_AUTH) {
        return new NextResponse('Invalid auth token', { status: 401 });
    }

    revalidatePath("/");

    return new NextResponse('Success', { status: 200 });
}