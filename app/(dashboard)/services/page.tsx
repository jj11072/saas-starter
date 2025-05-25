import { Music, Mic, Headphones, Settings, Video, FileAudio } from 'lucide-react';
import Image from 'next/image';

export default function ServicesPage() {
    return (
        <main className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <section className="py-20 bg-gradient-to-b from-black to-gray-800 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                            Studio Services
                        </h1>
                        <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-300">
                            Professional music production services for artists and creators
                        </p>
                    </div>
                </div>
            </section>

            {/* Main Services Section */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Beat Production */}
                        <div className="bg-white p-8 rounded-lg shadow-sm">
                            <div className="flex items-center justify-center h-16 w-16 rounded-full bg-orange-500 text-white mb-6">
                                <Music className="h-8 w-8" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">Beat Production</h3>
                            <p className="text-gray-600 mb-6">
                                Custom beat production tailored to your style and vision. From trap to afrobeats, we create the perfect foundation for your music.
                            </p>
                            <ul className="space-y-3 text-gray-600">
                                <li className="flex items-center">
                                    <span className="mr-2">•</span>
                                    Custom beat creation
                                </li>
                                <li className="flex items-center">
                                    <span className="mr-2">•</span>
                                    Genre-specific production
                                </li>
                                <li className="flex items-center">
                                    <span className="mr-2">•</span>
                                    Unlimited revisions
                                </li>
                            </ul>
                        </div>

                        {/* Recording */}
                        <div className="bg-white p-8 rounded-lg shadow-sm">
                            <div className="flex items-center justify-center h-16 w-16 rounded-full bg-orange-500 text-white mb-6">
                                <Mic className="h-8 w-8" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">Recording</h3>
                            <p className="text-gray-600 mb-6">
                                Professional recording services in our state-of-the-art studio. Perfect for vocals, instruments, and full band sessions.
                            </p>
                            <ul className="space-y-3 text-gray-600">
                                <li className="flex items-center">
                                    <span className="mr-2">•</span>
                                    Vocal recording
                                </li>
                                <li className="flex items-center">
                                    <span className="mr-2">•</span>
                                    Instrument recording
                                </li>
                                <li className="flex items-center">
                                    <span className="mr-2">•</span>
                                    Full band sessions
                                </li>
                            </ul>
                        </div>

                        {/* Mixing & Mastering */}
                        <div className="bg-white p-8 rounded-lg shadow-sm">
                            <div className="flex items-center justify-center h-16 w-16 rounded-full bg-orange-500 text-white mb-6">
                                <Settings className="h-8 w-8" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">Mixing & Mastering</h3>
                            <p className="text-gray-600 mb-6">
                                Professional mixing and mastering services to make your music sound radio-ready and competitive in today's market.
                            </p>
                            <ul className="space-y-3 text-gray-600">
                                <li className="flex items-center">
                                    <span className="mr-2">•</span>
                                    Professional mixing
                                </li>
                                <li className="flex items-center">
                                    <span className="mr-2">•</span>
                                    Industry-standard mastering
                                </li>
                                <li className="flex items-center">
                                    <span className="mr-2">•</span>
                                    Reference track matching
                                </li>
                            </ul>
                        </div>

                        {/* Music Videos */}
                        <div className="bg-white p-8 rounded-lg shadow-sm">
                            <div className="flex items-center justify-center h-16 w-16 rounded-full bg-orange-500 text-white mb-6">
                                <Video className="h-8 w-8" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">Music Videos</h3>
                            <p className="text-gray-600 mb-6">
                                Professional music video production services to bring your music to life visually.
                            </p>
                            <ul className="space-y-3 text-gray-600">
                                <li className="flex items-center">
                                    <span className="mr-2">•</span>
                                    Concept development
                                </li>
                                <li className="flex items-center">
                                    <span className="mr-2">•</span>
                                    Professional filming
                                </li>
                                <li className="flex items-center">
                                    <span className="mr-2">•</span>
                                    Post-production editing
                                </li>
                            </ul>
                        </div>

                        {/* Sound Design */}
                        <div className="bg-white p-8 rounded-lg shadow-sm">
                            <div className="flex items-center justify-center h-16 w-16 rounded-full bg-orange-500 text-white mb-6">
                                <FileAudio className="h-8 w-8" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">Sound Design</h3>
                            <p className="text-gray-600 mb-6">
                                Custom sound design for various media including games, films, and advertisements.
                            </p>
                            <ul className="space-y-3 text-gray-600">
                                <li className="flex items-center">
                                    <span className="mr-2">•</span>
                                    Game audio
                                </li>
                                <li className="flex items-center">
                                    <span className="mr-2">•</span>
                                    Film scoring
                                </li>
                                <li className="flex items-center">
                                    <span className="mr-2">•</span>
                                    Commercial audio
                                </li>
                            </ul>
                        </div>

                        {/* Consultation */}
                        <div className="bg-white p-8 rounded-lg shadow-sm">
                            <div className="flex items-center justify-center h-16 w-16 rounded-full bg-orange-500 text-white mb-6">
                                <Headphones className="h-8 w-8" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">Consultation</h3>
                            <p className="text-gray-600 mb-6">
                                One-on-one consultation sessions to help you develop your sound and career.
                            </p>
                            <ul className="space-y-3 text-gray-600">
                                <li className="flex items-center">
                                    <span className="mr-2">•</span>
                                    Career guidance
                                </li>
                                <li className="flex items-center">
                                    <span className="mr-2">•</span>
                                    Sound development
                                </li>
                                <li className="flex items-center">
                                    <span className="mr-2">•</span>
                                    Industry insights
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h2 className="text-3xl font-bold text-gray-900 mb-8">Ready to Get Started?</h2>
                        <p className="text-xl text-gray-600 mb-8">
                            Contact us to discuss your project and get a quote
                        </p>
                        <a
                            href="mailto:contact@ssiixx.com"
                            className="inline-block px-8 py-3 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors"
                        >
                            Contact Us
                        </a>
                    </div>
                </div>
            </section>
        </main>
    );
} 