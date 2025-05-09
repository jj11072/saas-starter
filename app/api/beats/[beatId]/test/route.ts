import { NextResponse } from "next/server";
import { db } from "@/lib/db/drizzle";
import { beats } from "@/lib/db/schema";
import { getUser } from "@/lib/db/queries";
import { eq } from "drizzle-orm";

type RouteContext = {
  params: Promise<{ beatId: string }>;
};

export async function GET(
  req: Request,
  context: RouteContext
) {
  try {
    const user = await getUser();
    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const params = await context.params;
    const beatId = parseInt(params.beatId);
    if (Number.isNaN(beatId)) {
      return new NextResponse("Invalid Beat ID", { status: 400 });
    }

    const beat = await db
      .select()
      .from(beats)
      .where(eq(beats.id, beatId))
      .limit(1);

    if (beat.length === 0) {
      return new NextResponse("Beat not found", { status: 404 });
    }

    return NextResponse.json(beat[0]);
  } catch (error) {
    console.error("[BEAT_TEST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
} 