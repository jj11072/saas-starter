import { Metadata } from "next";
import { BeatUploadForm } from "@/components/beats/beat-upload-form";

export const metadata: Metadata = {
    title: "Upload Beat",
    description: "Upload a new beat to your catalog",
};

export default function UploadBeatPage() {
    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-2xl font-bold tracking-tight">Upload Beat</h2>
            </div>
            <div className="grid gap-4">
                <BeatUploadForm />
            </div>
        </div>
    );
} 