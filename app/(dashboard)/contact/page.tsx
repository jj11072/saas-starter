import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export default function ContactPage() {
    return (
        <main className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <section className="py-20 bg-gradient-to-b from-black to-gray-800 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                            Contact Us
                        </h1>
                        <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-300">
                            Get in touch with us for inquiries, bookings, or collaborations
                        </p>
                    </div>
                </div>
            </section>

            {/* Contact Details and Form Section */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Contact Details */}
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-8">Get in Touch</h2>
                            <div className="space-y-6">
                                <div className="flex items-start">
                                    <div className="flex-shrink-0">
                                        <Mail className="h-6 w-6 text-orange-500" />
                                    </div>
                                    <div className="ml-3">
                                        <h3 className="text-lg font-medium text-gray-900">Email</h3>
                                        <p className="mt-1 text-gray-600">
                                            <a href="mailto:contact@ssiixx.com" className="hover:text-orange-500">
                                                contact@ssiixx.uk
                                            </a>
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <div className="flex-shrink-0">
                                        <Phone className="h-6 w-6 text-orange-500" />
                                    </div>
                                    <div className="ml-3">
                                        <h3 className="text-lg font-medium text-gray-900">Phone</h3>
                                        <p className="mt-1 text-gray-600">
                                            <a href="tel:+1234567890" className="hover:text-orange-500">
                                                +1 (234) 567-890
                                            </a>
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <div className="flex-shrink-0">
                                        <MapPin className="h-6 w-6 text-orange-500" />
                                    </div>
                                    <div className="ml-3">
                                        <h3 className="text-lg font-medium text-gray-900">Location</h3>
                                        <p className="mt-1 text-gray-600">Leeds, UK</p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <div className="flex-shrink-0">
                                        <Clock className="h-6 w-6 text-orange-500" />
                                    </div>
                                    <div className="ml-3">
                                        <h3 className="text-lg font-medium text-gray-900">Hours</h3>
                                        <p className="mt-1 text-gray-600">Monday - Friday: 10am - 6pm</p>
                                        <p className="text-gray-600">Saturday: By appointment</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="bg-white p-8 rounded-lg shadow-sm">
                            <h2 className="text-3xl font-bold text-gray-900 mb-8">Send a Message</h2>
                            <form className="space-y-6">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                        Name
                                    </label>
                                    <Input
                                        type="text"
                                        id="name"
                                        name="name"
                                        className="mt-1"
                                        placeholder="Your name"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                        Email
                                    </label>
                                    <Input
                                        type="email"
                                        id="email"
                                        name="email"
                                        className="mt-1"
                                        placeholder="your@email.com"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
                                        Subject
                                    </label>
                                    <Input
                                        type="text"
                                        id="subject"
                                        name="subject"
                                        className="mt-1"
                                        placeholder="What's this about?"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                                        Message
                                    </label>
                                    <Textarea
                                        id="message"
                                        name="message"
                                        rows={4}
                                        className="mt-1"
                                        placeholder="Your message..."
                                    />
                                </div>

                                <Button type="submit" className="w-full">
                                    Send Message
                                </Button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
} 