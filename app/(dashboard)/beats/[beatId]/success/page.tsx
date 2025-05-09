import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { CheckCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { stripe } from "@/lib/payments/stripe";
import { db } from "@/lib/db/drizzle";
import { purchases } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { getUser } from "@/lib/db/queries";

export const metadata: Metadata = {
    title: "Purchase Successful",
    description: "Your beat purchase was successful",
};

interface PageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function PurchaseSuccessPage({
    searchParams,
}: PageProps) {
    const params = await searchParams;
    const sessionId = params.session_id as string;
    const user = await getUser();

    if (!sessionId) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-4">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">Invalid Session</h1>
                <p className="text-gray-600 mb-8">No session ID provided. Please try your purchase again.</p>
                <Link href="/beats">
                    <Button>Return to Beats</Button>
                </Link>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-4">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">Authentication Required</h1>
                <p className="text-gray-600 mb-8">Please sign in to view your purchase.</p>
                <Link href="/login">
                    <Button>Sign In</Button>
                </Link>
            </div>
        );
    }

    try {
        // Verify the session with Stripe
        const session = await stripe.checkout.sessions.retrieve(sessionId);

        if (!session) {
            return (
                <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-4">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">Invalid Session</h1>
                    <p className="text-gray-600 mb-8">The session could not be found. Please contact support.</p>
                    <Link href="/beats">
                        <Button>Return to Beats</Button>
                    </Link>
                </div>
            );
        }

        // Check if the purchase is in the database
        const purchase = await db.query.purchases.findFirst({
            where: and(
                eq(purchases.stripePaymentId, session.payment_intent as string),
                eq(purchases.userId, user.id)
            ),
        });

        if (!purchase) {
            return (
                <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mb-4"></div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">Processing Your Purchase</h1>
                    <p className="text-gray-600 mb-8">Please wait while we confirm your purchase...</p>
                </div>
            );
        }

        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-4">
                <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
                <h1 className="text-2xl font-bold text-gray-900 mb-4">Purchase Successful!</h1>
                <p className="text-gray-600 mb-8">Your beat has been added to your library.</p>
                <div className="flex gap-4">
                    <Link href="/library">
                        <Button>View in Library</Button>
                    </Link>
                    <Link href="/beats">
                        <Button variant="outline">Browse More Beats</Button>
                    </Link>
                </div>
            </div>
        );
    } catch (error) {
        console.error("Error verifying purchase:", error);
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-4">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">Error</h1>
                <p className="text-gray-600 mb-8">There was an error verifying your purchase. Please contact support.</p>
                <Link href="/beats">
                    <Button>Return to Beats</Button>
                </Link>
            </div>
        );
    }
} 