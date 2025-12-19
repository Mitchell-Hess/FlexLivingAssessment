'use client';

import { NormalizedReview } from '@/lib/types/review';
import { Star, Calendar, User, MapPin, Check, X as XIcon } from 'lucide-react';
import { format } from 'date-fns';

interface ReviewCardProps {
  review: NormalizedReview;
  onToggleApproval: (reviewId: number, approved: boolean) => void;
  isApproved: boolean;
}

export default function ReviewCard({ review, onToggleApproval, isApproved }: ReviewCardProps) {
  const getRatingColor = (rating: number) => {
    if (rating >= 9) return 'bg-cyan-500/20 text-cyan-500 border-cyan-500';
    if (rating >= 7) return 'bg-zinc-800 text-white border-zinc-700';
    return 'bg-zinc-800 text-zinc-400 border-zinc-700';
  };

  const getChannelStyle = (channel: string) => {
    switch (channel.toLowerCase()) {
      case 'airbnb': return 'bg-zinc-800 text-white border-zinc-700';
      case 'booking.com': return 'bg-zinc-800 text-white border-zinc-700';
      case 'vrbo': return 'bg-zinc-800 text-white border-zinc-700';
      default: return 'bg-zinc-800 text-white border-zinc-700';
    }
  };

  return (
    <div className={`group relative bg-zinc-900 p-6 border transition-all duration-300 ${
      isApproved
        ? 'border-cyan-500'
        : 'border-zinc-800 hover:border-zinc-700'
    }`}>
      {/* Approval Indicator */}
      {isApproved && (
        <div className="absolute -top-3 -right-3 bg-cyan-500 text-zinc-950 p-2">
          <Check className="w-5 h-5" />
        </div>
      )}

      <div className="flex items-start justify-between mb-5">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <div className={`px-4 py-2 font-black text-lg border ${getRatingColor(review.averageRating)}`}>
              {review.averageRating.toFixed(1)}
            </div>
            <span className={`px-3 py-1.5 text-xs font-bold border uppercase tracking-wider ${getChannelStyle(review.channel || '')}`}>
              {review.channel}
            </span>
          </div>
          <h3 className="font-black text-white text-lg uppercase tracking-wide">{review.listingName}</h3>
        </div>

        <button
          onClick={() => onToggleApproval(review.id, !isApproved)}
          className={`flex items-center gap-2 px-6 py-3 font-bold text-sm transition-all uppercase tracking-wider ${
            isApproved
              ? 'bg-cyan-500 text-zinc-950 hover:bg-cyan-400'
              : 'bg-zinc-800 text-white hover:bg-zinc-700 border border-zinc-700'
          }`}
        >
          {isApproved ? (
            <>
              <Check className="w-4 h-4" />
              Approved
            </>
          ) : (
            <>
              <XIcon className="w-4 h-4" />
              Approve
            </>
          )}
        </button>
      </div>

      <p className="text-zinc-400 mb-6 leading-relaxed">{review.publicReview}</p>

      {/* Category Ratings */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {review.reviewCategory.map((cat, idx) => (
          <div key={idx} className="bg-zinc-950 border border-zinc-800 p-3">
            <div className="text-xs text-cyan-500 capitalize mb-2 font-bold uppercase tracking-wider">
              {cat.category.replace('_', ' ')}
            </div>
            <div className="flex items-center">
              <Star className="w-4 h-4 text-cyan-500 mr-1.5 fill-current" />
              <span className="font-black text-white">{cat.rating}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Meta Information */}
      <div className="flex items-center gap-6 text-sm text-zinc-500 border-t border-zinc-800 pt-4">
        <div className="flex items-center gap-2">
          <User className="w-4 h-4" />
          <span className="font-bold text-zinc-400">{review.guestName}</span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          <span className="font-bold text-zinc-400">{format(new Date(review.submittedAt), 'MMM dd, yyyy')}</span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          <span className="font-bold text-zinc-400">{review.propertyId}</span>
        </div>
      </div>
    </div>
  );
}
