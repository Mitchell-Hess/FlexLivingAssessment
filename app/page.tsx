import Link from 'next/link';
import { BarChart3, Home, ArrowRight, Star } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-transparent"></div>

        <div className="relative container mx-auto px-6 py-24">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/20 px-4 py-2 rounded-full mb-8">
              <Star className="w-4 h-4 text-cyan-500 fill-cyan-500" />
              <span className="text-cyan-500 text-sm font-semibold uppercase tracking-wider">Reviews Platform</span>
            </div>

            <h1 className="text-7xl md:text-8xl font-black text-white mb-6 leading-none">
              Flex Living
            </h1>

            <p className="text-2xl text-zinc-400 mb-16 max-w-2xl font-light">
              Enterprise-grade review analytics and property management dashboard for modern hospitality operations
            </p>

            <div className="grid md:grid-cols-2 gap-6 max-w-3xl">
              <Link
                href="/dashboard"
                className="group relative bg-white text-zinc-950 p-8 overflow-hidden transition-all hover:scale-105"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500 opacity-0 group-hover:opacity-10 transition-opacity blur-2xl"></div>

                <div className="relative">
                  <BarChart3 className="w-10 h-10 mb-6" />
                  <h3 className="text-2xl font-bold mb-2">Analytics Hub</h3>
                  <p className="text-zinc-600 mb-4 font-medium">
                    Advanced performance metrics and review management
                  </p>
                  <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider">
                    <span>Enter Dashboard</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>

              <Link
                href="/property/2B-N1"
                className="group relative bg-cyan-500 text-zinc-950 p-8 overflow-hidden transition-all hover:scale-105"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-zinc-950 opacity-0 group-hover:opacity-10 transition-opacity blur-2xl"></div>

                <div className="relative">
                  <Home className="w-10 h-10 mb-6" />
                  <h3 className="text-2xl font-bold mb-2">Property View</h3>
                  <p className="text-zinc-900 mb-4 font-medium">
                    Public showcase with curated guest testimonials
                  </p>
                  <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider">
                    <span>View Property</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="border-t border-zinc-800">
        <div className="container mx-auto px-6 py-24">
          <div className="grid md:grid-cols-4 gap-px bg-zinc-800">
            <div className="bg-zinc-950 p-8">
              <div className="text-cyan-500 font-bold text-sm uppercase tracking-wider mb-3">Integration</div>
              <h4 className="text-white font-bold text-lg mb-2">Multi-Channel</h4>
              <p className="text-zinc-500 text-sm leading-relaxed">Airbnb, Booking.com, Vrbo unified</p>
            </div>

            <div className="bg-zinc-950 p-8">
              <div className="text-cyan-500 font-bold text-sm uppercase tracking-wider mb-3">Analytics</div>
              <h4 className="text-white font-bold text-lg mb-2">Trend Detection</h4>
              <p className="text-zinc-500 text-sm leading-relaxed">Performance insights at scale</p>
            </div>

            <div className="bg-zinc-950 p-8">
              <div className="text-cyan-500 font-bold text-sm uppercase tracking-wider mb-3">Filtering</div>
              <h4 className="text-white font-bold text-lg mb-2">Smart Search</h4>
              <p className="text-zinc-500 text-sm leading-relaxed">Rating, channel, time-based</p>
            </div>

            <div className="bg-zinc-950 p-8">
              <div className="text-cyan-500 font-bold text-sm uppercase tracking-wider mb-3">Curation</div>
              <h4 className="text-white font-bold text-lg mb-2">Content Control</h4>
              <p className="text-zinc-500 text-sm leading-relaxed">Approval workflow built-in</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-zinc-800 py-8">
        <div className="container mx-auto px-6">
          <p className="text-zinc-600 text-sm">
            © 2024 Flex Living. Enterprise Review Management System.
          </p>
        </div>
      </div>
    </div>
  );
}
