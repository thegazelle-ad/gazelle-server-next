export const revalidate = 43200;
export const runtime = 'edge';
export const preferredRegion = 'fra1';

import { type NextRequest, NextResponse } from 'next/server'
import { getIssue } from '../../../../db'

export async function GET(request: NextRequest, { params }: { params: { issueNumber: string } }) {
    // convert to number if possible, else error
    const issueNumber = Number(params.issueNumber);
    if (isNaN(issueNumber)) {
        return new NextResponse('Invalid issue number', { status: 400 });
    }

    let issue;
    try {
        issue = await getIssue(issueNumber);
    } catch(e) {
        return new NextResponse('Issue not found', { status: 500 });
    }

    return NextResponse.json(
        { publishedAt: issue.publishedAt }, 
        { 
            status: 200,
            headers: {
                'Cache-Control': 'max-age=3600, s-maxage=3600, stale-while-revalidate',
            }
        },
    );
}
