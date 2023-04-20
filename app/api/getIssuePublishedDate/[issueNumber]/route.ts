import { type NextRequest, NextResponse } from 'next/server'
import { getIssue } from '../../../../db'

export async function GET(request: NextRequest, { params }: { params: { issueNumber: string } }) {
    // convert to number if possible, else error
    const issueNumber = Number(params.issueNumber);
    if (isNaN(issueNumber)) {
        return new NextResponse('Invalid issue number', { status: 400 });
    }

    const issue = await getIssue(issueNumber);

    return NextResponse.json({ publishedAt: issue.publishedAt });
}
