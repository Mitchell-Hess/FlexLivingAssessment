'use client';

import { useState, useEffect } from 'react';
import { NormalizedReview } from '@/lib/types/review';
import ReviewCard from '@/components/dashboard/ReviewCard';
import PropertyStats from '@/components/dashboard/PropertyStats';
import { Filter, SortAsc, SortDesc, Home, ArrowLeft, X } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const [reviews, setReviews] = useState<NormalizedReview[]>([]);
  const [filteredReviews, setFilteredReviews] = useState<NormalizedReview[]>([]);
  const [approvedReviews, setApprovedReviews] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);

  // Filter states
  const [selectedProperty, setSelectedProperty] = useState<string>('all');
  const [selectedChannel, setSelectedChannel] = useState<string>('all');
  const [minRating, setMinRating] = useState<string>('0');
  const [sortBy, setSortBy] = useState<'date' | 'rating'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Fetch reviews
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch('/api/reviews/hostaway');
        const data = await response.json();
        setReviews(data.data);
        setFilteredReviews(data.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching reviews:', error);
        setLoading(false);
      }
    };

    const fetchApprovals = async () => {
      try {
        const response = await fetch('/api/reviews/approve');
        const data = await response.json();
        setApprovedReviews(new Set(data.approvedReviewIds));
      } catch (error) {
        console.error('Error fetching approvals:', error);
      }
    };

    fetchReviews();
    fetchApprovals();
  }, []);

  // Apply filters and sorting
  useEffect(() => {
    let filtered = [...reviews];

    if (selectedProperty !== 'all') {
      filtered = filtered.filter(r => r.listingName === selectedProperty);
    }

    if (selectedChannel !== 'all') {
      filtered = filtered.filter(r => r.channel === selectedChannel);
    }

    if (minRating !== '0') {
      filtered = filtered.filter(r => r.averageRating >= parseFloat(minRating));
    }

    // Sort
    filtered.sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'rating') {
        comparison = a.averageRating - b.averageRating;
      } else {
        comparison = new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime();
      }
      return sortOrder === 'desc' ? -comparison : comparison;
    });

    setFilteredReviews(filtered);
  }, [reviews, selectedProperty, selectedChannel, minRating, sortBy, sortOrder]);

  const handleToggleApproval = async (reviewId: number, approved: boolean) => {
    try {
      const response = await fetch('/api/reviews/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reviewId, approved }),
      });

      if (response.ok) {
        setApprovedReviews(prev => {
          const newSet = new Set(prev);
          if (approved) {
            newSet.add(reviewId);
          } else {
            newSet.delete(reviewId);
          }
          return newSet;
        });
      }
    } catch (error) {
      console.error('Error toggling approval:', error);
    }
  };

  // Get unique properties and channels
  const properties = Array.from(new Set(reviews.map(r => r.listingName)));
  const channels = Array.from(new Set(reviews.map(r => r.channel || 'Unknown')));

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-16 w-16 border-4 border-zinc-800 border-t-cyan-500 mx-auto mb-4"></div>
          <p className="text-zinc-400 font-bold uppercase tracking-wider text-sm">Loading reviews...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Header */}
      <div className="bg-zinc-900 border-b border-zinc-800 sticky top-0 z-10">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="p-3 hover:bg-zinc-800 transition-colors border border-zinc-800"
              >
                <ArrowLeft className="w-5 h-5 text-cyan-500" />
              </Link>
              <div>
                <h1 className="text-3xl font-black text-white">Manager Dashboard</h1>
                <p className="text-sm text-cyan-500 uppercase tracking-wider font-bold">Review Analytics & Approval</p>
              </div>
            </div>
            <Link
              href="/property/2B-N1"
              className="flex items-center gap-2 bg-cyan-500 text-zinc-950 px-6 py-3 hover:bg-cyan-400 transition-colors font-bold text-sm uppercase tracking-wider"
            >
              <Home className="w-4 h-4" />
              View Property
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Stats Section */}
        <div className="mb-8">
          <PropertyStats reviews={reviews} />
        </div>

        {/* Filters Section */}
        <div className="bg-zinc-900 border border-zinc-800 p-6 mb-8">
          <div className="flex items-center gap-2 mb-6">
            <Filter className="w-5 h-5 text-cyan-500" />
            <h2 className="text-lg font-black text-white uppercase tracking-wider">Filters & Sorting</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <div>
              <label className="block text-xs font-bold text-cyan-500 mb-2 uppercase tracking-wider">
                Property
              </label>
              <select
                value={selectedProperty}
                onChange={(e) => setSelectedProperty(e.target.value)}
                className="w-full border border-zinc-800 px-3 py-2.5 focus:ring-2 focus:ring-cyan-500 focus:border-transparent bg-zinc-950 text-white text-sm font-medium"
              >
                <option value="all">All Properties</option>
                {properties.map(prop => (
                  <option key={prop} value={prop}>{prop}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-cyan-500 mb-2 uppercase tracking-wider">
                Channel
              </label>
              <select
                value={selectedChannel}
                onChange={(e) => setSelectedChannel(e.target.value)}
                className="w-full border border-zinc-800 px-3 py-2.5 focus:ring-2 focus:ring-cyan-500 focus:border-transparent bg-zinc-950 text-white text-sm font-medium"
              >
                <option value="all">All Channels</option>
                {channels.map(channel => (
                  <option key={channel} value={channel}>{channel}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-cyan-500 mb-2 uppercase tracking-wider">
                Min Rating
              </label>
              <select
                value={minRating}
                onChange={(e) => setMinRating(e.target.value)}
                className="w-full border border-zinc-800 px-3 py-2.5 focus:ring-2 focus:ring-cyan-500 focus:border-transparent bg-zinc-950 text-white text-sm font-medium"
              >
                <option value="0">All Ratings</option>
                <option value="9">9+ Excellent</option>
                <option value="8">8+ Great</option>
                <option value="7">7+ Good</option>
                <option value="6">6+ Fair</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-cyan-500 mb-2 uppercase tracking-wider">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'date' | 'rating')}
                className="w-full border border-zinc-800 px-3 py-2.5 focus:ring-2 focus:ring-cyan-500 focus:border-transparent bg-zinc-950 text-white text-sm font-medium"
              >
                <option value="date">Date</option>
                <option value="rating">Rating</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-cyan-500 mb-2 uppercase tracking-wider">
                Order
              </label>
              <button
                onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
                className="w-full border border-zinc-800 px-3 py-2.5 flex items-center justify-center gap-2 hover:bg-zinc-800 transition-colors text-white font-bold text-sm uppercase tracking-wider"
              >
                {sortOrder === 'desc' ? (
                  <>
                    <SortDesc className="w-4 h-4" />
                    Desc
                  </>
                ) : (
                  <>
                    <SortAsc className="w-4 h-4" />
                    Asc
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between border-t border-zinc-800 pt-4">
            <div className="text-sm text-zinc-400 font-medium">
              <span className="font-black text-white">{filteredReviews.length}</span> of {reviews.length} reviews
              <span className="mx-2">·</span>
              <span className="font-black text-cyan-500">{approvedReviews.size}</span> approved
            </div>
            {(selectedProperty !== 'all' || selectedChannel !== 'all' || minRating !== '0') && (
              <button
                onClick={() => {
                  setSelectedProperty('all');
                  setSelectedChannel('all');
                  setMinRating('0');
                }}
                className="flex items-center gap-1.5 text-sm text-zinc-400 hover:text-white font-bold transition-colors uppercase tracking-wider"
              >
                <X className="w-4 h-4" />
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Reviews List */}
        <div className="space-y-4">
          {filteredReviews.length === 0 ? (
            <div className="bg-zinc-900 border border-zinc-800 p-16 text-center">
              <p className="text-zinc-400 text-lg font-bold uppercase tracking-wider">No reviews match your filters</p>
            </div>
          ) : (
            filteredReviews.map(review => (
              <ReviewCard
                key={review.id}
                review={review}
                onToggleApproval={handleToggleApproval}
                isApproved={approvedReviews.has(review.id)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
