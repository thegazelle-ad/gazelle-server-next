import { revalidatePath } from 'next/cache'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
    const auth = request.nextUrl.searchParams.get('auth')

    if (auth !== process.env.CACHE_INVALIDATE_AUTH) {
        return Response.json({
            revalidated: false,
            now: Date.now(),
            message: 'Invalid auth token',
        })
    }

    revalidatePath("/");

    return Response.json({
        revalidated: true,
        now: Date.now(),
        message: 'Revalidated',
    })
}