import { auth } from "@/auth";
import { db } from "@/db";
import { timeLogs, activityLogs } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const taskId = request.nextUrl.searchParams.get("taskId");

    let query = db.query.timeLogs.findMany({
      with: {
        staff: true,
        task: true,
      },
    });

    if (taskId) {
      query = db.query.timeLogs.findMany({
        where: eq(timeLogs.taskId, taskId),
        with: {
          staff: true,
          task: true,
        },
      });
    }

    const logs = await query;
    return NextResponse.json(logs);
  } catch (error) {
    console.error("Error fetching time logs:", error);
    return NextResponse.json(
      { error: "Failed to fetch time logs" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { taskId, duration, billable, description } = body;

    if (!taskId || !duration) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const newLog = await db
      .insert(timeLogs)
      .values({
        taskId,
        staffId: session.user.id,
        duration: duration.toString(),
        billable: billable !== false,
        description,
      })
      .returning();

    // Log activity
    await db.insert(activityLogs).values({
      taskId,
      userId: session.user.id,
      activityType: "TIME_LOGGED",
      description: `Logged ${duration} hours`,
    });

    return NextResponse.json(newLog[0], { status: 201 });
  } catch (error) {
    console.error("Error creating time log:", error);
    return NextResponse.json(
      { error: "Failed to create time log" },
      { status: 500 }
    );
  }
}
