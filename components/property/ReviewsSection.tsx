'use client';

import { NormalizedReview } from '@/lib/types/review';
import { Star, Quote } from 'lucide-react';
import { format } from 'date-fns';

interface ReviewsSectionProps {
  reviews: NormalizedReview[];
}

export default function ReviewsSection({ reviews }: ReviewsSectionProps) {
  if (reviews.length === 0) {
    return null;
  }

  const averageRating = reviews.reduce((sum, r) => sum + r.averageRating, 0) / reviews.length;

  // Calculate category averages
  const categoryAverages: { [key: string]: number[] } = {};
  reviews.forEach(review => {
    review.reviewCategory.forEach(cat => {
      if (!categoryAverages[cat.category]) {
        categoryAverages[cat.category] = [];
      }
      categoryAverages[cat.category].push(cat.rating);
    });
  });

  const categoryScores = Object.entries(categoryAverages).map(([category, ratings]) => ({
    category,
    average: ratings.reduce((sum, r) => sum + r, 0) / ratings.length,
  }));

  return (
    <section className="py-20 bg-zinc-950 border-t border-zinc-800">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-5xl font-black text-white mb-12 uppercase tracking-wide">Guest Reviews</h2>

          {/* Overall Rating Card */}
          <div className="bg-zinc-900 border border-zinc-800 p-10 mb-10">
            <div className="grid md:grid-cols-3 gap-8">
              {/* Rating Score */}
              <div className="text-center md:border-r border-zinc-800">
                <div className="text-7xl font-black text-cyan-500 mb-4">
                  {averageRating.toFixed(1)}
                </div>
                <div className="flex items-center justify-center gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map(star => (
                    <Star
                      key={star}
                      className={`w-6 h-6 ${
                        star <= Math.round(averageRating / 2)
                          ? 'text-cyan-500 fill-current'
                          : 'text-zinc-700'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-sm text-zinc-400 font-bold uppercase tracking-wider">
                  Based on {reviews.length} review{reviews.length > 1 ? 's' : ''}
                </p>
              </div>

              {/* Category Breakdown */}
              <div className="md:col-span-2 space-y-5">
                {categoryScores.map(({ category, average }) => (
                  <div key={category}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-cyan-500 capitalize font-bold uppercase tracking-wider">
                        {category.replace('_', ' ')}
                      </span>
                      <span className="text-sm font-black text-white">
                        {average.toFixed(1)}
                      </span>
                    </div>
                    <div className="w-full bg-zinc-800 h-3">
                      <div
                        className="bg-cyan-500 h-3 transition-all duration-500"
                        style={{ width: `${(average / 10) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Individual Reviews */}
          <div className="space-y-6">
            {reviews.map(review => (
              <div
                key={review.id}
                className="bg-zinc-900 border border-zinc-800 p-8 hover:border-zinc-700 transition-all"
              >
                <div className="flex items-start gap-6">
                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-cyan-500 flex items-center justify-center">
                      <span className="text-zinc-950 font-black text-2xl">
                        {review.guestName.charAt(0)}
                      </span>
                    </div>
                  </div>

                  {/* Review Content */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-black text-white text-xl mb-1 uppercase tracking-wide">
                          {review.guestName}
                        </h3>
                        <p className="text-sm text-zinc-500 font-bold uppercase tracking-wider">
                          {format(new Date(review.submittedAt), 'MMMM yyyy')}
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map(star => (
                            <Star
                              key={star}
                              className={`w-5 h-5 ${
                                star <= Math.round(review.averageRating / 2)
                                  ? 'text-cyan-500 fill-current'
                                  : 'text-zinc-700'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="font-black text-white text-lg">
                          {review.averageRating.toFixed(1)}
                        </span>
                      </div>
                    </div>

                    {/* Quote */}
                    <div className="relative mb-6">
                      <Quote className="absolute -left-1 -top-1 w-8 h-8 text-zinc-800" />
                      <p className="text-zinc-400 leading-relaxed pl-8 text-lg">
                        {review.publicReview}
                      </p>
                    </div>

                    {/* Channel Badge */}
                    <div className="inline-flex items-center px-3 py-1.5 bg-zinc-950 border border-zinc-800">
                      <span className="text-xs text-cyan-500 font-black uppercase tracking-wider">
                        {review.channel}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
