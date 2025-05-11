'use client'
import { Button } from '@/components/ui/button';
import { Music, Play, Pause } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import useSWR from 'swr';

interface Beat {
    id: number;
    title: string;
    description: string | null;
    price: string;
    audioUrl: string;
    coverImageUrl: string | null;
    genre: string | null;
    bpm: number | null;
    key: string | null;
}

interface FeaturedBeatsCarouselProps {
    beats: Beat[];
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function FeaturedBeatsCarousel({ beats }: FeaturedBeatsCarouselProps) {
    const { data: user } = useSWR('/api/user', fetcher);
    const router = useRouter();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [playingBeat, setPlayingBeat] = useState<number | null>(null);
    const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
    const [isLoading, setIsLoading] = useState<number | null>(null);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((current) => (current + 1) % beats.length);
        }, 5000); // Change slide every 5 seconds

        return () => clearInterval(timer);
    }, [beats.length]);

    const handlePlay = async (beat: Beat) => {
        if (playingBeat === beat.id) {
            audio?.pause();
            setPlayingBeat(null);
            setAudio(null);
        } else {
            try {
                if (audio) {
                    audio.pause();
                    setAudio(null);
                }

                const newAudio = new Audio();
                newAudio.src = beat.audioUrl;
                newAudio.crossOrigin = 'anonymous';

                newAudio.oncanplay = () => {
                    newAudio.play()
                        .then(() => {
                            setAudio(newAudio);
                            setPlayingBeat(beat.id);
                        })
                        .catch((error) => {
                            toast.error('Failed to play audio. Please try again.');
                            setPlayingBeat(null);
                            setAudio(null);
                        });
                };

                newAudio.onended = () => {
                    setPlayingBeat(null);
                    setAudio(null);
                };

                newAudio.load();
            } catch (error) {
                toast.error('Failed to play audio. Please try again.');
                setPlayingBeat(null);
                setAudio(null);
            }
        }
    };

    const handleBuyClick = (beatId: number) => {
        if (!user) {
            toast.error("Please sign in to purchase beats");
            router.push("/sign-in");
            return;
        }
        router.push(`/beats/${beatId}`);
    };

    return (
        <div className="relative w-full overflow-hidden">
            <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
                {beats.map((beat) => (
                    <div key={beat.id} className="w-full flex-shrink-0">
                        <div className="p-1">
                            <div className="overflow-hidden rounded-lg bg-white shadow-lg">
                                <div className="relative h-48 sm:h-56 md:h-64">
                                    {beat.coverImageUrl ? (
                                        <Image
                                            src={beat.coverImageUrl}
                                            alt={beat.title}
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="h-full w-full bg-gray-100 flex items-center justify-center">
                                            <Music className="h-12 w-12 text-gray-400" />
                                        </div>
                                    )}
                                </div>
                                <div className="p-4">
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        {beat.title}
                                    </h3>
                                    <p className="mt-1 text-sm text-gray-500">
                                        {beat.genre} • {beat.bpm} BPM • {beat.key}
                                    </p>
                                    <div className="mt-4 flex items-center justify-between">
                                        <span className="text-lg font-bold text-gray-900">
                                            ${beat.price}
                                        </span>
                                        <div className="flex gap-2">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => handlePlay(beat)}
                                                disabled={isLoading === beat.id}
                                            >
                                                {playingBeat === beat.id ? (
                                                    <Pause className="h-4 w-4" />
                                                ) : (
                                                    <Play className="h-4 w-4" />
                                                )}
                                            </Button>
                                            <Button
                                                size="sm"
                                                onClick={() => handleBuyClick(beat.id)}
                                            >
                                                Buy
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                {beats.map((_, index) => (
                    <button
                        key={index}
                        className={`w-2 h-2 rounded-full transition-colors ${index === currentIndex ? 'bg-orange-500' : 'bg-gray-300'
                            }`}
                        onClick={() => setCurrentIndex(index)}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
} 