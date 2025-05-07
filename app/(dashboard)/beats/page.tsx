import { Metadata } from "next";
import { BeatsList } from "@/components/beats/beats-list";
import { BeatsHeader } from "@/components/beats/beats-header";

export const metadata: Metadata = {
    title: "Beats Marketplace",
    description: "Browse and purchase high-quality beats",
};

export default async function BeatsPage() {
    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <BeatsHeader />
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <BeatsList />
            </div>
        </div>
    );
} 