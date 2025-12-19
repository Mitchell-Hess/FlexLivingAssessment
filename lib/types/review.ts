export interface ReviewCategory {
  category: string;
  rating: number;
}

export interface Review {
  id: number;
  type: 'guest-to-host' | 'host-to-guest';
  status: 'published' | 'pending' | 'hidden';
  rating: number | null;
  publicReview: string;
  reviewCategory: ReviewCategory[];
  submittedAt: string;
  guestName: string;
  listingName: string;
  channel?: string;
  isApproved?: boolean;
}

export interface HostawayResponse {
  status: string;
  result: Review[];
}

export interface NormalizedReview extends Review {
  averageRating: number;
  submittedDate: Date;
  propertyId: string;
}

export interface PropertyStats {
  propertyName: string;
  totalReviews: number;
  averageRating: number;
  channelBreakdown: { [channel: string]: number };
  categoryAverages: { [category: string]: number };
  recentTrend: 'up' | 'down' | 'stable';
}
