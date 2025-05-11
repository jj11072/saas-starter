import { Button } from '@/components/ui/button';
import { Music, Mic, Headphones, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { getFeaturedBeats } from '@/lib/db/queries';
import { FeaturedBeatsCarousel } from '@/components/beats/featured-beats-carousel';

export default async function HomePage() {
  const featuredBeats = await getFeaturedBeats();

  return (
    <main>
      {/* Artist Profile Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-b from-black to-white text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            <div className="text-center lg:text-left lg:col-span-6">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                SSIIXX
                <span className="block bg-gradient-to-r from-red-600 via-yellow-500 to-green-600 bg-clip-text text-transparent">Professional Producer</span>
              </h1>
              <p className="mt-3 text-base sm:text-lg md:text-xl lg:text-xl">
                Creating high-quality beats for artists worldwide. Specializing in trap, afrobeats, and EDM.
              </p>
              <div className="mt-8 flex justify-center lg:justify-start">
                <Link href="/beats">
                  <Button size="lg" className="text-lg rounded-full">
                    Browse Beats
                    <Music className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
            <div className="flex justify-center lg:justify-end lg:col-span-6">
              <div className="relative w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 rounded-full overflow-hidden">
                <Image
                  src="/ssiixx2.png"
                  alt="Studio Setup"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Beats Carousel */}
      <section className="py-12 sm:py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
              Featured Beats
            </h2>
            <p className="mt-3 max-w-2xl mx-auto text-base sm:text-lg text-gray-500">
              Check out our latest and most popular beats
            </p>
          </div>
          <FeaturedBeatsCarousel beats={featuredBeats} />
        </div>
      </section>

      {/* Beats Marketplace Section */}
      <section className="py-12 sm:py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
              Beats Marketplace
            </h2>
            <p className="mt-3 max-w-2xl mx-auto text-base sm:text-lg text-gray-500">
              Browse and purchase high-quality beats for your next project
            </p>
          </div>
          <div className="mt-8 sm:mt-12 grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-orange-500 text-white">
                <Music className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">
                Trap Beats
              </h3>
              <p className="mt-2 text-base text-gray-500">
                Hard-hitting trap beats with modern production
              </p>
              <Link href="/beats?genre=trap">
                <Button variant="outline" className="mt-4">
                  Browse Trap Beats
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-orange-500 text-white">
                <Music className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">
                Hip Hop Beats
              </h3>
              <p className="mt-2 text-base text-gray-500">
                Classic and modern hip hop instrumentals
              </p>
              <Link href="/beats?genre=hiphop">
                <Button variant="outline" className="mt-4">
                  Browse Hip Hop Beats
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-orange-500 text-white">
                <Music className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">
                R&B Beats
              </h3>
              <p className="mt-2 text-base text-gray-500">
                Smooth R&B beats with soulful melodies
              </p>
              <Link href="/beats?genre=rnb">
                <Button variant="outline" className="mt-4">
                  Browse R&B Beats
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Studio Services Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
              Studio Services
            </h2>
            <p className="mt-3 max-w-2xl mx-auto text-base sm:text-lg text-gray-500">
              Professional music production services for artists
            </p>
          </div>
          <div className="mt-8 sm:mt-12 grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-orange-500 text-white">
                <Music className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">
                Beat Production
              </h3>
              <p className="mt-2 text-base text-gray-500">
                Custom beat production for your next project
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-orange-500 text-white">
                <Mic className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">
                Recording
              </h3>
              <p className="mt-2 text-base text-gray-500">
                Professional recording and mixing services
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-orange-500 text-white">
                <Headphones className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">
                Mixing & Mastering
              </h3>
              <p className="mt-2 text-base text-gray-500">
                High-quality mixing and mastering for your tracks
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
