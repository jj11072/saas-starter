'use client'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Pause, ShoppingCart } from "lucide-react";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface Beat {
    id: number;
    title: string;
    description: string;
    price: number;
    audioUrl: string;
    coverImageUrl: string | null;
    genre: string | null;
    bpm: number | null;
    key: string | null;
    userId: number;
    isPublished: boolean;
}

export function BeatsList() {
    const router = useRouter();
    const [playingBeat, setPlayingBeat] = useState<number | null>(null);
    const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
    const [isLoading, setIsLoading] = useState<number | null>(null);
    const [beats, setBeats] = useState<Beat[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchBeats = async () => {
            try {
                console.log('Fetching beats from API...');
                const response = await fetch('/api/beats');
                if (!response.ok) {
                    throw new Error(`Failed to fetch beats: ${response.statusText}`);
                }
                const data = await response.json();
                console.log('Received beats:', data.length);
                setBeats(data);
            } catch (error) {
                console.error('Error fetching beats:', error);
                setError('Failed to load beats. Please try again later.');
                toast.error('Failed to load beats');
            } finally {
                setLoading(false);
            }
        };

        fetchBeats();
    }, []);

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
                        setError('Failed to load audio. Please try again.');
                        return;
                    }
                    const audioElement = e.target as HTMLAudioElement;
                    const error = audioElement.error;
                    console.error('Audio error:', {
                        error,
                        message: error?.message,
                        code: error?.code
                    });
                    setError('Failed to load audio. Please try again.');
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
                };

                newAudio.onloadeddata = () => {
                    console.log('Audio data loaded:', {
                        beatId: beat.id,
                        readyState: newAudio.readyState
                    });
                };

                // Set up progress tracking
                newAudio.onprogress = () => {
                    console.log('Audio loading progress:', {
                        beatId: beat.id,
                        readyState: newAudio.readyState,
                        networkState: newAudio.networkState
                    });
                };

                // Set up stalled event
                newAudio.onstalled = () => {
                    console.log('Audio loading stalled:', {
                        beatId: beat.id,
                        readyState: newAudio.readyState,
                        networkState: newAudio.networkState
                    });
                };

                // Set up waiting event
                newAudio.onwaiting = () => {
                    console.log('Audio waiting for data:', {
                        beatId: beat.id,
                        readyState: newAudio.readyState,
                        networkState: newAudio.networkState
                    });
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

    const handlePurchase = async (beatId: number) => {
        try {
            setIsLoading(beatId);
            const response = await fetch(`/api/beats/${beatId}/purchase`, {
                method: "GET",
                credentials: "include",
            });

            if (response.status === 401) {
                toast.error("Please sign in to purchase beats");
                router.push("/sign-in");
                return;
            }

            if (!response.ok) {
                const errorData = await response.text();
                throw new Error(errorData || "Failed to initiate purchase");
            }

            const { url } = await response.json();
            if (!url) {
                throw new Error("No checkout URL received");
            }

            window.location.href = url;
        } catch (error) {
            console.error("Purchase error:", error);
            toast.error(error instanceof Error ? error.message : "Something went wrong");
        } finally {
            setIsLoading(null);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[200px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center p-4">
                <p className="text-red-500">{error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="mt-4 px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
                >
                    Try Again
                </button>
            </div>
        );
    }

    if (beats.length === 0) {
        return (
            <div className="text-center p-4">
                <p className="text-gray-500">No beats available yet.</p>
            </div>
        );
    }

    return (
        <>
            {beats.map((beat) => (
                <Card key={beat.id} className="overflow-hidden">
                    <CardHeader className="p-0">
                        <div className="relative h-48 w-full">
                            {beat.coverImageUrl ? (
                                <Image
                                    src={beat.coverImageUrl}
                                    alt={beat.title}
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <div className="h-full w-full bg-muted flex items-center justify-center">
                                    <span className="text-muted-foreground">No cover image</span>
                                </div>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent className="p-4">
                        <CardTitle className="mb-2">{beat.title}</CardTitle>
                        <p className="text-sm text-muted-foreground mb-2">{beat.description}</p>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            {beat.genre && <span>{beat.genre}</span>}
                            {beat.bpm && <span>{beat.bpm} BPM</span>}
                            {beat.key && <span>{beat.key}</span>}
                        </div>
                    </CardContent>
                    <CardFooter className="p-4 pt-0 flex justify-between">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handlePlay(beat)}
                        >
                            {playingBeat === beat.id ? (
                                <Pause className="h-4 w-4" />
                            ) : (
                                <Play className="h-4 w-4" />
                            )}
                        </Button>
                        <div className="flex items-center space-x-2">
                            <span className="font-bold">${beat.price}</span>
                            <Button
                                size="sm"
                                onClick={() => handlePurchase(beat.id)}
                                disabled={isLoading === beat.id}
                            >
                                <ShoppingCart className="h-4 w-4 mr-2" />
                                {isLoading === beat.id ? "Processing..." : "Buy"}
                            </Button>
                        </div>
                    </CardFooter>
                </Card>
            ))}
        </>
    );
} 