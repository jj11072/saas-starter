import { NextResponse } from "next/server";
import { db } from "@/lib/db/drizzle";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { getUser } from "@/lib/db/queries";

export async function PATCH(req: Request) {
  try {
    const user = await getUser();
    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { name, displayName, bio, location, website, socialLinks } = body;

    await db
      .update(users)
      .set({
        name,
        displayName,
        bio,
        location,
        website,
        socialLinks,
        updatedAt: new Date(),
      })
      .where(eq(users.id, user.id));

    return new NextResponse("Profile updated successfully", { status: 200 });
  } catch (error) {
    console.error("[PROFILE_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
} 