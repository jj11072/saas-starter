'use client'
import { useState, useEffect } from "react";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "@/lib/db/schema";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const formSchema = z.object({
    name: z.string().min(1, "Name is required").max(100),
    displayName: z.string().max(100).optional(),
    bio: z.string().max(500).optional(),
    location: z.string().max(100).optional(),
    website: z.string().url().optional().or(z.literal("")),
    socialLinks: z.string().optional(),
});

export function ProfileForm() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const { data: user } = useSWR<User>("/api/user", fetcher);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            displayName: "",
            bio: "",
            location: "",
            website: "",
            socialLinks: "",
        },
    });

    useEffect(() => {
        if (user) {
            form.reset({
                name: user.name || "",
                displayName: user.displayName || "",
                bio: user.bio || "",
                location: user.location || "",
                website: user.website || "",
                socialLinks: user.socialLinks || "",
            });
        }
    }, [user, form]);

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            setIsLoading(true);

            const response = await fetch("/api/profile", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(values),
            });

            if (!response.ok) {
                throw new Error("Failed to update profile");
            }

            toast.success("Profile updated successfully!");
            router.refresh();
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Profile Information</CardTitle>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Your name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="displayName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Display Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Your display name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="bio"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Bio</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Tell us about yourself"
                                            className="resize-none"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="location"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Location</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Your location" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="website"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Website</FormLabel>
                                    <FormControl>
                                        <Input placeholder="https://your-website.com" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="socialLinks"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Social Links</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Enter your social media links (one per line)"
                                            className="resize-none"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? "Saving..." : "Save Changes"}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
} 