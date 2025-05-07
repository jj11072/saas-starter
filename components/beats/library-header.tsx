import { Button } from "@/components/ui/button";
import { Music } from "lucide-react";
import Link from "next/link";

export function LibraryHeader() {
    return (
        <div className="flex items-center justify-between space-y-2">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Your Library</h2>
                <p className="text-muted-foreground">
                    Access and manage your purchased beats
                </p>
            </div>
            <div className="flex items-center space-x-2">
                <Link href="/beats">
                    <Button variant="outline">
                        <Music className="mr-2 h-4 w-4" />
                        Browse Beats
                    </Button>
                </Link>
            </div>
        </div>
    );
} 