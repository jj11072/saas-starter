'use client'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Pause, Download } from "lucide-react";
import { useState, useEffect } from "react";
import Image from "next/image";
import { toast } from "sonner";

interface Beat {
    id: string;
    title: string;
    description: string;
    genre: string;
    bpm: number;
    key: string;
    audioUrl: string;
    coverImageUrl: string | null;
    purchaseDate: string;
}

interface License {
    name: string;
    terms: string;
}

interface PurchasedBeat {
    beat: Beat;
    license: License;
}

export function LibraryList() {
    const [beats, setBeats] = useState<Beat[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
    const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);

    useEffect(() => {
        const fetchBeats = async () => {
            try {
                const response = await fetch("/api/beats/library");
                if (!response.ok) {
                    throw new Error("Failed to fetch beats");
                }
                const data = await response.json();
                setBeats(data);
            } catch (error) {
                console.error(error);
                toast.error("Failed to load your beats");
            } finally {
                setLoading(false);
            }
        };

        fetchBeats();
    }, []);

    const handlePlay = (beat: Beat) => {
        if (currentlyPlaying === beat.id) {
            audioElement?.pause();
            setCurrentlyPlaying(null);
            setAudioElement(null);
        } else {
            if (audioElement) {
                audioElement.pause();
            }
            const audio = new Audio(beat.audioUrl);
            audio.play();
            setAudioElement(audio);
            setCurrentlyPlaying(beat.id);

            audio.onended = () => {
                setCurrentlyPlaying(null);
                setAudioElement(null);
            };
        }
    };

    const handleDownload = async (beat: Beat) => {
        try {
            const response = await fetch(beat.audioUrl);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${beat.title}.mp3`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            toast.success("Download started");
        } catch (error) {
            console.error(error);
            toast.error("Failed to download beat");
        }
    };

    if (loading) {
        return <div>Loading your beats...</div>;
    }

    if (beats.length === 0) {
        return <div>You haven't purchased any beats yet.</div>;
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {beats.map((beat) => (
                <Card key={beat.id} className="overflow-hidden">
                    <CardHeader className="p-0">
                        <div className="relative h-48 w-full">
                            {beat.coverImageUrl && (
                                <Image
                                    src={beat.coverImageUrl}
                                    alt={beat.title}
                                    fill
                                    className="object-cover"
                                />
                            )}
                        </div>
                    </CardHeader>
                    <CardContent className="p-4">
                        <CardTitle className="mb-2">{beat.title}</CardTitle>
                        <p className="text-sm text-muted-foreground mb-2">{beat.description}</p>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <span>{beat.genre}</span>
                            <span>{beat.bpm} BPM</span>
                            <span>{beat.key}</span>
                        </div>
                        <div className="mt-2 text-sm">
                            <span className="font-medium">Purchased:</span>{" "}
                            {new Date(beat.purchaseDate).toLocaleDateString()}
                        </div>
                    </CardContent>
                    <CardFooter className="p-4 pt-0 flex justify-between">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handlePlay(beat)}
                        >
                            {currentlyPlaying === beat.id ? (
                                <Pause className="h-4 w-4" />
                            ) : (
                                <Play className="h-4 w-4" />
                            )}
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDownload(beat)}
                        >
                            <Download className="h-4 w-4" />
                        </Button>
                    </CardFooter>
                </Card>
            ))}
        </div>
    );
} 