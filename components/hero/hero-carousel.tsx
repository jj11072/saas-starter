'use client'

import 'hero-slider/dist/index.css';
import HeroSlider, { Nav, Overlay, Slide, ButtonsNav, MenuNav, SideNav } from 'hero-slider';
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from 'react';
import useSWR from 'swr';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Home, LogOut, User } from 'lucide-react';
import { signOut } from '@/app/(login)/actions';
import { useRouter } from 'next/navigation';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const slides = [
    {
        title: "Buy Premium Beats",
        description: "Discover high-quality beats from talented producers. Find the perfect sound for your next hit.",
        image: "/ssiixx-market.png",
        buttonText: "Browse Beats",
        buttonLink: "/beats"
    },
    {
        title: "Artist Profile",
        description: "Connect with SSIIXX, a professional producer specializing in trap, afrobeats, and EDM.",
        image: "/ssiixx-artist.png",
        buttonText: "View Artist",
        buttonLink: "/artist"
    },
    {
        title: "Professional Services",
        description: "Get custom beats, mixing, mastering, and production services tailored to your needs.",
        image: "/ssiixx-services.png",
        buttonText: "Our Services",
        buttonLink: "/services"
    },
    {
        title: "Get in Touch",
        description: "Have questions? Want to collaborate? Reach out and let's create something amazing together.",
        image: "/ssiixx-contact.png",
        buttonText: "Contact Us",
        buttonLink: "/contact"
    }
];

function UserMenu() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { data: user } = useSWR('/api/user', fetcher);
    const router = useRouter();

    async function handleSignOut() {
        await signOut();
        router.refresh();
        router.push('/');
    }

    if (!user) {
        return (
            <div className="flex items-center space-x-4">
                <Link
                    href="/pricing"
                    className="text-sm font-medium text-white hover:text-orange-500"
                >
                    Pricing
                </Link>
                <Button asChild className="rounded-full bg-orange-500 hover:bg-orange-600">
                    <Link href="/sign-up">Sign Up</Link>
                </Button>
            </div>
        );
    }

    return (
        <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <DropdownMenuTrigger>
                <Avatar className="cursor-pointer size-9">
                    <AvatarImage alt={user.name || ''} />
                    <AvatarFallback>
                        {user.email
                            .split(' ')
                            .map((n: string) => n[0])
                            .join('')}
                    </AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem className="cursor-pointer">
                    <Link href="/dashboard" className="flex w-full items-center">
                        <Home className="mr-2 h-4 w-4" />
                        <span>Dashboard</span>
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                    <Link href="/profile" className="flex w-full items-center">
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                    </Link>
                </DropdownMenuItem>
                <form action={handleSignOut} className="w-full">
                    <button type="submit" className="flex w-full">
                        <DropdownMenuItem className="w-full flex-1 cursor-pointer">
                            <LogOut className="mr-2 h-4 w-4" />
                            <span>Sign out</span>
                        </DropdownMenuItem>
                    </button>
                </form>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export function HeroCarousel() {
    return (
        <div className="relative h-screen">
            <HeroSlider
                height="100vh"
                autoplay={{
                    autoplayDuration: 5000,
                    autoplayDebounce: 0
                }}
                controller={{
                    initialSlide: 1,
                    slidingDuration: 500,
                    slidingDelay: 100
                }}
                settings={{
                    sliderColor: "#fff",
                    navbarStyle: {
                        color: "rgba(255, 255, 255, 0.5)",
                        activeColor: "#f97316"
                    }
                }}
                accessibility={{
                    shouldDisplayButtons: true,
                    shouldSlideOnArrowKeypress: true
                }}
                animations={{
                    slidingAnimation: "fade",
                    sliderFadeInDuration: 0,
                    navbarFadeInDuration: 0,
                    navbarFadeInDelay: 0
                }}
            >
                <Overlay>
                    <div className="absolute top-0 left-0 right-0 z-50">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center">
                                    <Link href="/" className="flex items-center">
                                        <span className="text-xl font-semibold text-white">SSIIXX.UK</span>
                                    </Link>
                                </div>
                                <UserMenu />
                            </div>
                        </div>
                    </div>
                    {slides.map((slide, index) => (
                        <Slide
                            key={index}
                            label={slide.title}
                            background={{
                                backgroundImageSrc: slide.image,
                                backgroundAnimation: "zoom",
                                backgroundAnimationDuration: "30s",
                                width: "100%",
                                height: "80%",
                                backgroundImageStyle: {
                                    objectFit: "cover",
                                    objectPosition: "center center",
                                    width: "100%",
                                    height: "100%"
                                }
                            }}
                        >
                            <div className="absolute inset-0 bg-black/85" />
                            <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-4">
                                <h1 className="text-5xl md:text-6xl font-bold mb-4 animate-fade-in">{slide.title}</h1>
                                <p className="text-xl md:text-2xl mb-8 max-w-2xl animate-fade-in-delay">{slide.description}</p>
                                <div className="flex justify-center w-full">
                                    <Link href={slide.buttonLink}>
                                        <Button
                                            size="lg"
                                            className="text-lg px-8 py-6 animate-fade-in-delay-2 bg-orange-500 hover:bg-orange-600 text-white rounded-full"
                                        >
                                            {slide.buttonText}
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </Slide>
                    ))}
                </Overlay>
                <ButtonsNav />
                <SideNav />
            </HeroSlider>
        </div>
    );
}