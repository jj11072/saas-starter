import { Mail, Phone, MapPin, Youtube, Music } from 'lucide-react';
import Image from 'next/image';

export default function ArtistPage() {
    return (
        <main className="min-h-screen bg-gray-50">
            {/* Contact Details Section */}
            <section className="py-12 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row items-center gap-8">
                        <div className="relative w-48 h-48 rounded-full overflow-hidden">
                            <Image
                                src="/ssiixx2.png"
                                alt="SSIIXX"
                                fill
                                className="object-cover"
                                priority
                            />
                        </div>
                        <div className="flex-1">
                            <h1 className="text-4xl font-bold text-gray-900">SSIIXX</h1>
                            <p className="mt-2 text-xl text-gray-600">Professional Producer & Artist</p>
                            <div className="mt-6 space-y-4">
                                <div className="flex items-center text-gray-600">
                                    <Mail className="h-5 w-5 mr-3" />
                                    <a href="mailto:contact@ssiixx.com" className="hover:text-orange-500">
                                        contact@ssiixx.com
                                    </a>
                                </div>
                                <div className="flex items-center text-gray-600">
                                    <Phone className="h-5 w-5 mr-3" />
                                    <a href="tel:+1234567890" className="hover:text-orange-500">
                                        07350 292 279
                                    </a>
                                </div>
                                <div className="flex items-center text-gray-600">
                                    <MapPin className="h-5 w-5 mr-3" />
                                    <span>Leeds, UK</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Latest Releases Section */}
            <section className="py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-8">Latest Releases</h2>

                    {/* YouTube Section */}
                    <div className="mb-12">
                        <div className="flex items-center mb-4">
                            <Youtube className="h-6 w-6 text-red-600 mr-2" />
                            <h3 className="text-xl font-semibold text-gray-900">YouTube</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="aspect-video">
                                <iframe
                                    className="w-full h-full rounded-lg"
                                    src="https://www.youtube.com/embed/8TwbtjT-4Hg?si=qn2LgZzqRue3J_D3&amp;start=103"
                                    title="YouTube video player"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                />
                            </div>
                            <div className="aspect-video">
                                <iframe
                                    className="w-full h-full rounded-lg"
                                    src="https://www.youtube.com/embed/p3cFoznqxzo?si=mppJrXK-vROPVg-7&amp;start=103"
                                    title="YouTube video player"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                />
                            </div>
                        </div>
                    </div>

                    {/* Spotify Section */}
                    <div>
                        <div className="flex items-center mb-4">
                            <Music className="h-6 w-6 text-green-500 mr-2" />
                            <h3 className="text-xl font-semibold text-gray-900">Spotify</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="aspect-square">
                                <iframe
                                    title="Spotify Track"
                                    className="w-full h-full rounded-lg"
                                    src="https://open.spotify.com/embed/track/1n1qwXelG157oG0BDuLUjf?utm_source=generator&theme=0"
                                    allow="encrypted-media"
                                />
                            </div>
                            <div className="aspect-square">
                                <iframe
                                    title="Spotify Track"
                                    className="w-full h-full rounded-lg"
                                    src="https://open.spotify.com/embed/track/1D9KPv11lhTg5PCEpY5M3g?utm_source=generator"
                                    allow="encrypted-media"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
} 