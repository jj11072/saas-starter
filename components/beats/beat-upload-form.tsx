'use client'
import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const formSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    price: z.string().refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
        message: "Price must be a positive number",
    }),
    genre: z.string().min(1, "Genre is required"),
    bpm: z.string().refine((val) => !isNaN(parseInt(val)) && parseInt(val) > 0, {
        message: "BPM must be a positive number",
    }),
    key: z.string().min(1, "Key is required"),
    audioFile: z.instanceof(File, { message: "Audio file is required" }),
    coverImage: z.instanceof(File).optional(),
});

export function BeatUploadForm() {
    const router = useRouter();
    const [isUploading, setIsUploading] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            description: "",
            price: "",
            genre: "",
            bpm: "",
            key: "",
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            setIsUploading(true);

            // Get pre-signed URL for audio file
            const audioResponse = await fetch("/api/beats/presigned-url", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    filename: values.audioFile.name,
                    contentType: values.audioFile.type,
                }),
            });

            if (!audioResponse.ok) {
                throw new Error("Failed to get upload URL for audio file");
            }

            const { signedUrl: audioSignedUrl, url: audioUrl } = await audioResponse.json();

            // Upload audio file directly to S3
            const audioUploadResponse = await fetch(audioSignedUrl, {
                method: "PUT",
                body: values.audioFile,
                headers: {
                    "Content-Type": values.audioFile.type,
                },
            });

            if (!audioUploadResponse.ok) {
                throw new Error("Failed to upload audio file");
            }

            // Handle cover image if provided
            let coverImageUrl = null;
            if (values.coverImage) {
                const imageResponse = await fetch("/api/beats/presigned-url", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        filename: values.coverImage.name,
                        contentType: values.coverImage.type,
                    }),
                });

                if (!imageResponse.ok) {
                    throw new Error("Failed to get upload URL for cover image");
                }

                const { signedUrl: imageSignedUrl, url: imageUrl } = await imageResponse.json();

                const imageUploadResponse = await fetch(imageSignedUrl, {
                    method: "PUT",
                    body: values.coverImage,
                    headers: {
                        "Content-Type": values.coverImage.type,
                    },
                });

                if (!imageUploadResponse.ok) {
                    throw new Error("Failed to upload cover image");
                }

                coverImageUrl = imageUrl;
            }

            // Create beat record with metadata
            const response = await fetch("/api/beats/upload", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title: values.title,
                    description: values.description,
                    price: values.price,
                    genre: values.genre,
                    bpm: values.bpm,
                    key: values.key,
                    audioUrl,
                    coverImageUrl,
                }),
            });

            if (!response.ok) {
                const errorData = await response.text();
                throw new Error(errorData || "Failed to create beat record");
            }

            toast.success("Beat uploaded successfully");
            router.push("/beats");
            router.refresh();
        } catch (error) {
            console.error("Upload error:", error);
            toast.error(error instanceof Error ? error.message : "Something went wrong");
        } finally {
            setIsUploading(false);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter beat title" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Describe your beat"
                                    className="resize-none"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Price ($)</FormLabel>
                                <FormControl>
                                    <Input type="number" step="0.01" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="genre"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Genre</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g., Hip Hop, Trap" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="bpm"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>BPM</FormLabel>
                                <FormControl>
                                    <Input type="number" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="key"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Key</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g., C# minor" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="audioFile"
                    render={({ field: { value, onChange, ...field } }) => (
                        <FormItem>
                            <FormLabel>Audio File</FormLabel>
                            <FormControl>
                                <Input
                                    type="file"
                                    accept="audio/*"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            onChange(file);
                                        }
                                    }}
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="coverImage"
                    render={({ field: { value, onChange, ...field } }) => (
                        <FormItem>
                            <FormLabel>Cover Image (Optional)</FormLabel>
                            <FormControl>
                                <Input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            onChange(file);
                                        }
                                    }}
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" disabled={isUploading}>
                    {isUploading ? "Uploading..." : "Upload Beat"}
                </Button>
            </form>
        </Form>
    );
} 