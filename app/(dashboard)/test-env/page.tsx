'use client'
import { useEffect, useState } from "react";

export default function TestEnvPage() {
    const [envVars, setEnvVars] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const checkEnv = async () => {
            try {
                const response = await fetch('/api/test-env');
                const data = await response.json();
                setEnvVars(data);
            } catch (err) {
                setError('Failed to fetch environment variables');
            }
        };

        checkEnv();
    }, []);

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-2xl font-bold tracking-tight">Environment Variables Test</h2>
            </div>
            <div className="space-y-4">
                {error ? (
                    <div className="text-red-500">{error}</div>
                ) : envVars ? (
                    <div className="space-y-2">
                        <p><strong>AWS Region:</strong> {envVars.region || 'Not set'}</p>
                        <p><strong>AWS Bucket:</strong> {envVars.bucket || 'Not set'}</p>
                        <p><strong>Has Access Key:</strong> {envVars.hasAccessKey ? 'Yes' : 'No'}</p>
                        <p><strong>Has Secret Key:</strong> {envVars.hasSecretKey ? 'Yes' : 'No'}</p>
                    </div>
                ) : (
                    <div>Loading...</div>
                )}
            </div>
        </div>
    );
} 