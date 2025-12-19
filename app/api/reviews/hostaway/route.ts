import { NextResponse } from 'next/server';
import { Review, NormalizedReview, HostawayResponse } from '@/lib/types/review';
import mockData from '@/public/data/mock-reviews.json';

// Hostaway API configuration
const HOSTAWAY_API_URL = 'https://api.hostaway.com/v1/reviews';
const HOSTAWAY_ACCOUNT_ID = '61148';
const HOSTAWAY_API_KEY = 'f94377ebbbb479490bb3ec364649168dc443dda2e4830facaf5de2e74ccc9152';

/**
 * Normalize review data from Hostaway API
 * Calculates average ratings, parses dates, and extracts property IDs
 */
function normalizeReviews(reviews: Review[]): NormalizedReview[] {
  return reviews.map(review => {
    // Calculate average rating from review categories
    const categoryRatings = review.reviewCategory.map(cat => cat.rating);
    const averageRating = review.rating ||
      (categoryRatings.length > 0
        ? categoryRatings.reduce((sum, r) => sum + r, 0) / categoryRatings.length
        : 0);

    // Parse the submitted date
    const submittedDate = new Date(review.submittedAt);

    // Extract property ID from listing name (simplified - using first word)
    const propertyId = review.listingName.split(' ')[0] + '-' + review.listingName.split(' ')[1];

    return {
      ...review,
      averageRating: Math.round(averageRating * 10) / 10,
      submittedDate,
      propertyId,
      isApproved: review.status === 'published', // Default to approved if published
      channel: review.channel || 'Hostaway',
    };
  });
}

/**
 * Fetch reviews from Hostaway API
 * Falls back to mock data if API is unavailable or returns no results
 */
async function fetchHostawayReviews(): Promise<Review[]> {
  try {
    const response = await fetch(HOSTAWAY_API_URL, {
      headers: {
        'Authorization': `Bearer ${HOSTAWAY_API_KEY}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store', // Disable caching for fresh data
    });

    if (!response.ok) {
      console.log('Hostaway API returned error, using mock data');
      return (mockData as HostawayResponse).result;
    }

    const data: HostawayResponse = await response.json();

    // If API returns no reviews (sandbox environment), use mock data
    if (!data.result || data.result.length === 0) {
      console.log('Hostaway API returned no reviews, using mock data');
      return (mockData as HostawayResponse).result;
    }

    return data.result;
  } catch (error) {
    console.error('Error fetching from Hostaway API:', error);
    console.log('Falling back to mock data');
    return (mockData as HostawayResponse).result;
  }
}

/**
 * GET /api/reviews/hostaway
 *
 * Fetches and normalizes review data from Hostaway API
 * Returns structured, usable data for the frontend
 *
 * Query parameters:
 * - property: Filter by property ID
 * - channel: Filter by booking channel
 * - minRating: Filter by minimum rating
 * - sort: Sort field (rating, date)
 * - order: Sort order (asc, desc)
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const property = searchParams.get('property');
    const channel = searchParams.get('channel');
    const minRating = searchParams.get('minRating');
    const sort = searchParams.get('sort') || 'date';
    const order = searchParams.get('order') || 'desc';

    // Fetch reviews from API or mock data
    const reviews = await fetchHostawayReviews();

    // Normalize the review data
    let normalizedReviews = normalizeReviews(reviews);

    // Apply filters
    if (property) {
      normalizedReviews = normalizedReviews.filter(r => r.propertyId === property);
    }

    if (channel) {
      normalizedReviews = normalizedReviews.filter(r => r.channel === channel);
    }

    if (minRating) {
      const minRatingNum = parseFloat(minRating);
      normalizedReviews = normalizedReviews.filter(r => r.averageRating >= minRatingNum);
    }

    // Apply sorting
    normalizedReviews.sort((a, b) => {
      let comparison = 0;

      if (sort === 'rating') {
        comparison = a.averageRating - b.averageRating;
      } else if (sort === 'date') {
        comparison = a.submittedDate.getTime() - b.submittedDate.getTime();
      }

      return order === 'desc' ? -comparison : comparison;
    });

    return NextResponse.json({
      status: 'success',
      data: normalizedReviews,
      count: normalizedReviews.length,
    });
  } catch (error) {
    console.error('Error in reviews API:', error);
    return NextResponse.json(
      {
        status: 'error',
        message: 'Failed to fetch reviews',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
