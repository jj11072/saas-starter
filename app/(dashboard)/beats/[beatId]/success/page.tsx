import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { CheckCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { stripe } from "@/lib/payments/stripe";
import { db } from "@/lib/db/drizzle";
import { purchases } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { getUser } from "@/lib/db/queries";

export const metadata: Metadata = {
    title: "Purchase Successful",
    description: "Your beat purchase was successful",
};

export default async function PurchaseSuccessPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const params = await searchParams;
    const sessionId = params.session_id as string;
    if (!sessionId) {
        return (
            <div className="flex-1 space-y-4 p-8 pt-6">
                <div className="flex flex-col items-center justify-center space-y-4 text-center">
                    <h1 className="text-2xl font-bold">Invalid Session</h1>
                    <p className="text-muted-foreground">
                        No session ID provided. Please try your purchase again.
                    </p>
                    <Link href="/beats">
                        <Button>Back to Beats</Button>
                    </Link>
                </div>
            </div>
        );
    }

    // Verify the session
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (!session) {
        return (
            <div className="flex-1 space-y-4 p-8 pt-6">
                <div className="flex flex-col items-center justify-center space-y-4 text-center">
                    <h1 className="text-2xl font-bold">Invalid Session</h1>
                    <p className="text-muted-foreground">
                        Could not verify your purchase. Please contact support if you were charged.
                    </p>
                    <Link href="/beats">
                        <Button>Back to Beats</Button>
                    </Link>
                </div>
            </div>
        );
    }

    // Check if the purchase is in the database (webhook has completed)
    const user = await getUser();
    if (!user) {
        return (
            <div className="flex-1 space-y-4 p-8 pt-6">
                <div className="flex flex-col items-center justify-center space-y-4 text-center">
                    <h1 className="text-2xl font-bold">Unauthorized</h1>
                    <p className="text-muted-foreground">
                        Please sign in to view your purchase.
                    </p>
                    <Link href="/login">
                        <Button>Sign In</Button>
                    </Link>
                </div>
            </div>
        );
    }

    const purchase = await db
        .select()
        .from(purchases)
        .where(
            eq(purchases.stripePaymentId, session.payment_intent as string)
        )
        .limit(1);

    if (purchase.length === 0) {
        // Purchase not yet in database (webhook hasn't completed)
        return (
            <div className="flex-1 space-y-4 p-8 pt-6">
                <div className="flex flex-col items-center justify-center space-y-4 text-center">
                    <Loader2 className="h-16 w-16 text-orange-500 animate-spin" />
                    <h1 className="text-2xl font-bold">Processing Your Purchase</h1>
                    <p className="text-muted-foreground">
                        Please wait while we confirm your purchase. This may take a few moments.
                    </p>
                    <div className="flex space-x-4">
                        <Link href="/library">
                            <Button disabled>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                View in Library
                            </Button>
                        </Link>
                        <Link href="/beats">
                            <Button variant="outline">Browse More Beats</Button>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    // Purchase confirmed
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