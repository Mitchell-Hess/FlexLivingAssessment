import { NextResponse } from 'next/server';

// In-memory store for approved reviews (in production, this would be a database)
let approvedReviews: Set<number> = new Set();

/**
 * GET /api/reviews/approve
 * Returns list of approved review IDs
 */
export async function GET() {
  return NextResponse.json({
    status: 'success',
    approvedReviewIds: Array.from(approvedReviews),
  });
}

/**
 * POST /api/reviews/approve
 * Approve or unapprove a review for public display
 *
 * Body: { reviewId: number, approved: boolean }
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { reviewId, approved } = body;

    if (typeof reviewId !== 'number') {
      return NextResponse.json(
        { status: 'error', message: 'Invalid reviewId' },
        { status: 400 }
      );
    }

    if (approved) {
      approvedReviews.add(reviewId);
    } else {
      approvedReviews.delete(reviewId);
    }

    return NextResponse.json({
      status: 'success',
      reviewId,
      approved,
      message: `Review ${approved ? 'approved' : 'unapproved'} successfully`,
    });
  } catch (error) {
    console.error('Error in approve API:', error);
    return NextResponse.json(
      {
        status: 'error',
        message: 'Failed to update review approval',
      },
      { status: 500 }
    );
  }
}
