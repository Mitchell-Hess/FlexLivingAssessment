'use client';

import { NormalizedReview } from '@/lib/types/review';
import { Star, TrendingUp, TrendingDown, Minus, BarChart3 } from 'lucide-react';

interface PropertyStatsProps {
  reviews: NormalizedReview[];
}

export default function PropertyStats({ reviews }: PropertyStatsProps) {
  // Group reviews by property
  const propertiesList = Array.from(
    new Set(reviews.map(r => r.listingName))
  ).map(propertyName => {
    const propertyReviews = reviews.filter(r => r.listingName === propertyName);
    const avgRating = propertyReviews.reduce((sum, r) => sum + r.averageRating, 0) / propertyReviews.length;

    // Calculate trend (compare recent vs older reviews)
    const sortedByDate = [...propertyReviews].sort(
      (a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
    );
    const recentReviews = sortedByDate.slice(0, Math.ceil(sortedByDate.length / 3));
    const olderReviews = sortedByDate.slice(Math.ceil(sortedByDate.length / 3));

    const recentAvg = recentReviews.length > 0
      ? recentReviews.reduce((sum, r) => sum + r.averageRating, 0) / recentReviews.length
      : avgRating;
    const olderAvg = olderReviews.length > 0
      ? olderReviews.reduce((sum, r) => sum + r.averageRating, 0) / olderReviews.length
      : avgRating;

    const trend = recentAvg > olderAvg + 0.3 ? 'up' : recentAvg < olderAvg - 0.3 ? 'down' : 'stable';

    // Channel breakdown
    const channelBreakdown: { [key: string]: number } = {};
    propertyReviews.forEach(r => {
      const channel = r.channel || 'Unknown';
      channelBreakdown[channel] = (channelBreakdown[channel] || 0) + 1;
    });

    return {
      propertyName,
      totalReviews: propertyReviews.length,
      avgRating,
      trend,
      channelBreakdown,
    };
  });

  const getTrendIcon = (trend: string) => {
    if (trend === 'up') return <TrendingUp className="w-5 h-5" />;
    if (trend === 'down') return <TrendingDown className="w-5 h-5" />;
    return <Minus className="w-5 h-5" />;
  };

  const getTrendStyle = (trend: string) => {
    if (trend === 'up') return 'bg-cyan-500/20 text-cyan-500 border-cyan-500';
    if (trend === 'down') return 'bg-zinc-800 text-zinc-400 border-zinc-700';
    return 'bg-zinc-800 text-zinc-500 border-zinc-700';
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-cyan-500">
          <BarChart3 className="w-5 h-5 text-zinc-950" />
        </div>
        <h2 className="text-xl font-black text-white uppercase tracking-wider">Property Performance</h2>
      </div>

      <div className="space-y-4">
        {propertiesList.map((property, idx) => (
          <div
            key={idx}
            className="border border-zinc-800 p-6 hover:border-zinc-700 transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-black text-white text-lg uppercase tracking-wide">{property.propertyName}</h3>
              <div className={`flex items-center gap-2 px-4 py-2 border font-bold text-sm uppercase tracking-wider ${getTrendStyle(property.trend)}`}>
                {getTrendIcon(property.trend)}
                <span className="capitalize">{property.trend}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-zinc-950 border border-zinc-800 p-4">
                <div className="text-xs text-cyan-500 mb-2 font-bold uppercase tracking-wider">Avg Rating</div>
                <div className="flex items-center">
                  <Star className="w-5 h-5 text-cyan-500 mr-2 fill-current" />
                  <span className="font-black text-2xl text-white">
                    {property.avgRating.toFixed(1)}
                  </span>
                </div>
              </div>

              <div className="bg-zinc-950 border border-zinc-800 p-4">
                <div className="text-xs text-cyan-500 mb-2 font-bold uppercase tracking-wider">Reviews</div>
                <div className="font-black text-2xl text-white">{property.totalReviews}</div>
              </div>

              <div className="col-span-2 bg-zinc-950 border border-zinc-800 p-4">
                <div className="text-xs text-cyan-500 mb-3 font-bold uppercase tracking-wider">Channels</div>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(property.channelBreakdown).map(([channel, count]) => (
                    <span
                      key={channel}
                      className="text-xs bg-cyan-500 text-zinc-950 px-3 py-1.5 font-black uppercase tracking-wider"
                    >
                      {channel} ({count})
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
