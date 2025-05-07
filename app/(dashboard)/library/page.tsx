import { Metadata } from "next";
import { LibraryList } from "@/components/beats/library-list";
import { LibraryHeader } from "@/components/beats/library-header";

export const metadata: Metadata = {
    title: "Your Library",
    description: "View and manage your purchased beats",
};

export default async function LibraryPage() {
    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <LibraryHeader />
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <LibraryList />
            </div>
        </div>
    );
} 