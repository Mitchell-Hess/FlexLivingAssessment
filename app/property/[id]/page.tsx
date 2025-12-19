'use client';

import { useState, useEffect } from 'react';
import { NormalizedReview } from '@/lib/types/review';
import ReviewsSection from '@/components/property/ReviewsSection';
import {
  MapPin,
  Users,
  Bed,
  Bath,
  Wifi,
  Tv,
  Coffee,
  Wind,
  ArrowLeft,
  LayoutDashboard,
} from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function PropertyPage() {
  const params = useParams();
  const propertyId = params.id as string;
  const [reviews, setReviews] = useState<NormalizedReview[]>([]);
  const [approvedReviews, setApprovedReviews] = useState<NormalizedReview[]>([]);
  const [loading, setLoading] = useState(true);

  // Property data (in a real app, this would come from an API)
  const propertyData = {
    '2B-N1': {
      name: '2B N1 A - 29 Shoreditch Heights',
      location: 'Shoreditch, London',
      bedrooms: 2,
      bathrooms: 1,
      maxGuests: 4,
      description:
        'Modern and stylish 2-bedroom apartment in the heart of Shoreditch. Perfect for business travelers or tourists wanting to explore East London. The apartment features contemporary design, high-speed WiFi, and is within walking distance of Old Street station.',
      amenities: [
        { icon: Wifi, name: 'High-Speed WiFi' },
        { icon: Tv, name: 'Smart TV' },
        { icon: Coffee, name: 'Coffee Machine' },
        { icon: Wind, name: 'Air Conditioning' },
      ],
      images: [
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
      ],
    },
    '1B-W8': {
      name: '1B W8 C - Kensington Gardens Flat',
      location: 'Kensington, London',
      bedrooms: 1,
      bathrooms: 1,
      maxGuests: 2,
      description:
        'Elegant 1-bedroom flat in upscale Kensington, close to Hyde Park and world-class museums. Beautifully furnished with attention to detail, perfect for couples seeking a luxurious London experience.',
      amenities: [
        { icon: Wifi, name: 'High-Speed WiFi' },
        { icon: Tv, name: 'Smart TV' },
        { icon: Coffee, name: 'Coffee Machine' },
        { icon: Wind, name: 'Air Conditioning' },
      ],
      images: [
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
      ],
    },
  };

  const property = propertyData[propertyId as keyof typeof propertyData] || propertyData['2B-N1'];

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all reviews
        const reviewsResponse = await fetch('/api/reviews/hostaway');
        const reviewsData = await reviewsResponse.json();
        const allReviews = reviewsData.data;

        // Filter reviews for this property
        const propertyReviews = allReviews.filter(
          (r: NormalizedReview) => r.propertyId === propertyId
        );
        setReviews(propertyReviews);

        // Fetch approved review IDs
        const approvalsResponse = await fetch('/api/reviews/approve');
        const approvalsData = await approvalsResponse.json();
        const approvedIds = new Set(approvalsData.approvedReviewIds);

        // Filter to only approved reviews
        const approved = propertyReviews.filter((r: NormalizedReview) =>
          approvedIds.has(r.id)
        );
        setApprovedReviews(approved);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [propertyId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-16 w-16 border-4 border-zinc-800 border-t-cyan-500 mx-auto mb-4"></div>
          <p className="text-zinc-400 font-bold uppercase tracking-wider text-sm">Loading property...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Header */}
      <div className="bg-zinc-900 border-b border-zinc-800 sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="p-3 hover:bg-zinc-800 transition-colors border border-zinc-800"
            >
              <ArrowLeft className="w-5 h-5 text-cyan-500" />
            </Link>
            <Link
              href="/dashboard"
              className="flex items-center gap-2 bg-cyan-500 text-zinc-950 px-6 py-3 hover:bg-cyan-400 transition-colors font-bold text-sm uppercase tracking-wider"
            >
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </Link>
          </div>
        </div>
      </div>

      {/* Hero Image */}
      <div className="relative h-[600px] bg-zinc-900">
        <img
          src={property.images[0]}
          alt={property.name}
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/50 to-transparent"></div>

        {/* Property Title Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-12">
          <div className="container mx-auto">
            <div className="max-w-6xl mx-auto">
              <h1 className="text-6xl font-black text-white mb-4 leading-none">
                {property.name}
              </h1>
              <div className="flex items-center text-cyan-500 text-lg font-bold uppercase tracking-wider">
                <MapPin className="w-5 h-5 mr-2" />
                <span>{property.location}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Property Details */}
      <div className="container mx-auto px-6 py-16">
        <div className="max-w-6xl mx-auto">
          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-px bg-zinc-800 mb-16">
            <div className="bg-zinc-900 border border-zinc-800 p-8 text-center">
              <Bed className="w-10 h-10 text-cyan-500 mx-auto mb-4" />
              <div className="font-black text-3xl text-white mb-2">
                {property.bedrooms}
              </div>
              <div className="text-sm text-zinc-400 font-bold uppercase tracking-wider">
                Bedroom{property.bedrooms > 1 ? 's' : ''}
              </div>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 p-8 text-center">
              <Bath className="w-10 h-10 text-cyan-500 mx-auto mb-4" />
              <div className="font-black text-3xl text-white mb-2">
                {property.bathrooms}
              </div>
              <div className="text-sm text-zinc-400 font-bold uppercase tracking-wider">
                Bathroom{property.bathrooms > 1 ? 's' : ''}
              </div>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 p-8 text-center">
              <Users className="w-10 h-10 text-cyan-500 mx-auto mb-4" />
              <div className="font-black text-3xl text-white mb-2">
                {property.maxGuests}
              </div>
              <div className="text-sm text-zinc-400 font-bold uppercase tracking-wider">
                Max Guests
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mb-16">
            <h2 className="text-4xl font-black text-white mb-6 uppercase tracking-wide">About This Property</h2>
            <p className="text-zinc-400 leading-relaxed text-lg">{property.description}</p>
          </div>

          {/* Amenities */}
          <div className="mb-16">
            <h2 className="text-4xl font-black text-white mb-6 uppercase tracking-wide">Amenities</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-zinc-800">
              {property.amenities.map((amenity, idx) => {
                const Icon = amenity.icon;
                return (
                  <div
                    key={idx}
                    className="flex items-center gap-4 bg-zinc-900 border border-zinc-800 p-6 hover:border-cyan-500 transition-all"
                  >
                    <div className="p-3 bg-cyan-500">
                      <Icon className="w-6 h-6 text-zinc-950" />
                    </div>
                    <span className="text-white font-bold text-lg uppercase tracking-wide">{amenity.name}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <ReviewsSection reviews={approvedReviews} />

      {/* Footer */}
      <footer className="bg-zinc-900 border-t border-zinc-800 py-12">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto text-center">
            <p className="text-zinc-400 text-sm font-bold uppercase tracking-wider mb-2">
              © 2024 Flex Living. All rights reserved.
            </p>
            <p className="text-sm text-zinc-600 font-bold uppercase tracking-wider">
              {approvedReviews.length} approved review{approvedReviews.length !== 1 ? 's' : ''} displayed
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
