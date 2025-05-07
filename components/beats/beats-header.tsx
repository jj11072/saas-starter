import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export function BeatsHeader() {
    return (
        <div className="flex items-center justify-between space-y-2">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Beats Marketplace</h2>
                <p className="text-muted-foreground">
                    Browse and purchase high-quality beats from talented producers
                </p>
            </div>
            <div className="flex items-center space-x-2">
                <Link href="/beats/upload">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Upload Beat
                    </Button>
                </Link>
            </div>
        </div>
    );
} 