'use client'
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";

export default function TestS3Page() {
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<{
        uploadUrl: string;
        downloadUrl: string;
        key: string;
    } | null>(null);
    const [error, setError] = useState<string | null>(null);

    const testS3 = async () => {
        try {
            setIsLoading(true);
            setError(null);

            const response = await fetch("/api/test-s3", {
                method: "POST",
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.details || "Failed to test S3");
            }

            const data = await response.json();
            setResult(data);
            toast.success("S3 test successful!");
        } catch (error) {
            console.error("S3 test error:", error);
            setError(error instanceof Error ? error.message : "Failed to test S3 integration");
            toast.error("Failed to test S3 integration");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-2xl font-bold tracking-tight">Test S3 Integration</h2>
            </div>
            <div className="space-y-4">
                <Button onClick={testS3} disabled={isLoading}>
                    {isLoading ? "Testing..." : "Test S3 Integration"}
                </Button>

                {error && (
                    <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
                        <h3 className="font-medium">Error:</h3>
                        <p>{error}</p>
                    </div>
                )}

                {result && (
                    <div className="space-y-4 rounded-lg border p-4">
                        <h3 className="font-medium">Test Results:</h3>
                        <div className="space-y-2">
                            <p>
                                <span className="font-medium">Upload URL:</span>{" "}
                                <a
                                    href={result.uploadUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-500 hover:underline"
                                >
                                    {result.uploadUrl}
                                </a>
                            </p>
                            <p>
                                <span className="font-medium">Signed Download URL:</span>{" "}
                                <a
                                    href={result.downloadUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-500 hover:underline"
                                >
                                    {result.downloadUrl}
                                </a>
                            </p>
                            <p>
                                <span className="font-medium">File Key:</span> {result.key}
                            </p>
                            <p className="text-sm text-muted-foreground">
                                Note: The download URL will expire in 1 hour
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
} 