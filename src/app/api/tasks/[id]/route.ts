import { auth } from "@/auth";
import { db } from "@/db";
import { tasks, activityLogs } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const task = await db.query.tasks.findFirst({
      where: eq(tasks.id, id),
      with: {
        client: true,
        createdBy: true,
        assignedTo: true,
        timeLogs: {
          with: {
            staff: true,
          },
        },
        activityLogs: {
          with: {
            user: true,
          },
        },
        attachments: true,
      },
    });

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    // Check permissions
    if (
      session.user?.role === "STAFF" &&
      task.assignedToId !== session.user.id
    ) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json(task);
  } catch (error) {
    console.error("Error fetching task:", error);
    return NextResponse.json(
      { error: "Failed to fetch task" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session || !["ADMIN", "MANAGER"].includes(session.user?.role || "")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { status, priority, assignedToId, description } = body;

    // Get current task to compare changes
    const currentTask = await db.query.tasks.findFirst({
      where: eq(tasks.id, id),
    });

    if (!currentTask) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    const updated = await db
      .update(tasks)
      .set({
        status,
        priority,
        assignedToId,
        description,
        updatedAt: new Date(),
      })
      .where(eq(tasks.id, id))
      .returning();

    if (!updated.length) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    // Log activity for status change
    if (status && status !== currentTask.status) {
      await db.insert(activityLogs).values({
        taskId: id,
        userId: session.user.id,
        activityType: "STATUS_CHANGED",
        description: `Status changed from ${currentTask.status} to ${status}`,
      });
    }

    // Log activity for priority change
    if (priority && priority !== currentTask.priority) {
      await db.insert(activityLogs).values({
        taskId: id,
        userId: session.user.id,
        activityType: "TASK_UPDATED",
        description: `Priority changed from ${currentTask.priority} to ${priority}`,
      });
    }

    // Log activity for assignment change
    if (assignedToId && assignedToId !== currentTask.assignedToId) {
      await db.insert(activityLogs).values({
        taskId: id,
        userId: session.user.id,
        activityType: "TASK_ASSIGNED",
        description: `Task reassigned`,
      });
    }

    return NextResponse.json(updated[0]);
  } catch (error) {
    console.error("Error updating task:", error);
    return NextResponse.json(
      { error: "Failed to update task" },
      { status: 500 }
    );
  }
}
