import { Button } from '@/components/ui/button';
import { Music, Mic, Headphones, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function HomePage() {
  return (
    <main>
      {/* Artist Profile Section */}
      <section className="py-20 bg-gradient-to-b from-black to-white text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                SSIIXX
                <span className="block bg-gradient-to-r from-red-600 via-yellow-500 to-green-600 bg-clip-text text-transparent">Professional Producer</span>
              </h1>
              <p className="mt-3 text-base sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">
                Creating high-quality beats for artists worldwide. Specializing in trap, afrobeats, and EDM.
              </p>
              <div className="mt-8 sm:max-w-lg sm:mx-auto sm:text-center lg:text-left lg:mx-0">
                <Link href="/beats">
                  <Button size="lg" className="text-lg rounded-full">
                    Browse Beats
                    <Music className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
            <div className="mt-12 relative sm:max-w-lg sm:mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-span-6 lg:flex lg:items-center">
              <div className="relative w-96 h-96 rounded-full overflow-hidden">
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

      {/* Beats Marketplace Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Beats Marketplace
            </h2>
            <p className="mt-3 max-w-2xl mx-auto text-lg text-gray-500">
              Browse and purchase high-quality beats for your next project
            </p>
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
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
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Studio Services
            </h2>
            <p className="mt-3 max-w-2xl mx-auto text-lg text-gray-500">
              Professional music production services for artists
            </p>
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
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
