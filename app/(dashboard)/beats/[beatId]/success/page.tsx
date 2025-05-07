import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Purchase Successful",
    description: "Your beat purchase was successful",
};

export default function PurchaseSuccessPage() {
    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <CheckCircle className="h-16 w-16 text-green-500" />
                <h1 className="text-2xl font-bold">Purchase Successful!</h1>
                <p className="text-muted-foreground">
                    Your beat has been added to your library. You can now download and use it according to the license terms.
                </p>
                <div className="flex space-x-4">
                    <Link href="/library">
                        <Button>View in Library</Button>
                    </Link>
                    <Link href="/beats">
                        <Button variant="outline">Browse More Beats</Button>
                    </Link>
                </div>
            </div>
        </div>
    );
} 