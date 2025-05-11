'use client'
import { Button } from '@/components/ui/button';
import { Music, Play, Pause } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { toast } from "sonner";

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

export function FeaturedBeatsCarousel({ beats }: FeaturedBeatsCarouselProps) {
    const [playingBeat, setPlayingBeat] = useState<number | null>(null);
    const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
    const [isLoading, setIsLoading] = useState<number | null>(null);

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

                // Create a new audio element
                const newAudio = new Audio();

                // Validate the audio URL
                if (!beat.audioUrl) {
                    console.error('No audio URL provided for beat:', beat.id);
                    throw new Error('No audio URL provided');
                }

                console.log('Setting up audio player:', {
                    beatId: beat.id,
                    url: beat.audioUrl
                });

                // Set up error handling
                newAudio.onerror = ((e: Event | string) => {
                    if (typeof e === 'string') {
                        console.error('Audio error:', e);
                        toast.error('Failed to load audio. Please try again.');
                        return;
                    }
                    const audioElement = e.target as HTMLAudioElement;
                    const error = audioElement.error;
                    console.error('Audio error:', {
                        error,
                        message: error?.message,
                        code: error?.code
                    });

                    // Handle specific error codes
                    switch (error?.code) {
                        case MediaError.MEDIA_ERR_ABORTED:
                            console.log('Audio playback aborted');
                            break;
                        case MediaError.MEDIA_ERR_NETWORK:
                            toast.error('Network error. Please check your connection.');
                            break;
                        case MediaError.MEDIA_ERR_DECODE:
                            toast.error('Audio format not supported. Please try a different format.');
                            break;
                        case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
                            toast.error('Audio format not supported. Please try a different format.');
                            break;
                        default:
                            toast.error('Failed to load audio. Please try again.');
                    }

                    setPlayingBeat(null);
                    setAudio(null);
                }) as OnErrorEventHandler;

                // Set up success handling
                newAudio.oncanplay = () => {
                    console.log('Audio can play:', {
                        beatId: beat.id,
                        readyState: newAudio.readyState
                    });
                    newAudio.play()
                        .then(() => {
                            console.log('Playback started:', beat.id);
                            setAudio(newAudio);
                            setPlayingBeat(beat.id);
                        })
                        .catch((error) => {
                            console.error('Playback error:', {
                                error,
                                beatId: beat.id,
                                readyState: newAudio.readyState
                            });
                            toast.error('Failed to play audio. Please try again.');
                            setPlayingBeat(null);
                            setAudio(null);
                        });
                };

                // Set up loading events
                newAudio.onloadstart = () => {
                    console.log('Audio loading started:', beat.id);
                    setPlayingBeat(beat.id); // Show loading state
                };

                // Set up ended event
                newAudio.onended = () => {
                    setPlayingBeat(null);
                    setAudio(null);
                };

                // Set the source and start loading
                newAudio.preload = 'auto';
                newAudio.crossOrigin = 'anonymous';
                newAudio.src = beat.audioUrl;
                newAudio.load();

            } catch (error) {
                console.error('Error setting up audio:', {
                    error,
                    beatId: beat.id,
                    url: beat.audioUrl
                });
                toast.error('Failed to play audio. Please try again.');
                setPlayingBeat(null);
                setAudio(null);
            }
        }
    };

    return (
        <Carousel
            opts={{
                align: "start",
                loop: true,
            }}
            className="w-full"
        >
            <CarouselContent>
                {beats.map((beat) => (
                    <CarouselItem key={beat.id} className="basis-full sm:basis-1/2 lg:basis-1/3">
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
                                            <Link href={`/beats/${beat.id}`}>
                                                <Button size="sm">
                                                    Buy
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious className="hidden sm:flex" />
            <CarouselNext className="hidden sm:flex" />
        </Carousel>
    );
} 