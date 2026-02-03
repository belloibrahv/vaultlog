import { auth } from "@/auth";
import { db } from "@/db";
import { tasks, clients, activityLogs } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const clientId = searchParams.get("clientId");
    const status = searchParams.get("status");
    const assignedTo = searchParams.get("assignedTo");

    let query = db.query.tasks.findMany({
      with: {
        client: true,
        createdBy: true,
        assignedTo: true,
      },
    });

    // Build filters based on role
    if (session.user?.role === "STAFF") {
      // Staff can only see tasks assigned to them
      query = db.query.tasks.findMany({
        where: eq(tasks.assignedToId, session.user.id),
        with: {
          client: true,
          createdBy: true,
          assignedTo: true,
        },
      });
    }

    const allTasks = await query;

    // Apply additional filters
    let filtered = allTasks;
    if (clientId) {
      filtered = filtered.filter((t) => t.clientId === clientId);
    }
    if (status) {
      filtered = filtered.filter((t) => t.status === status);
    }
    if (assignedTo) {
      filtered = filtered.filter((t) => t.assignedToId === assignedTo);
    }

    return NextResponse.json(filtered);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return NextResponse.json(
      { error: "Failed to fetch tasks" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session || !["ADMIN", "MANAGER"].includes(session.user?.role || "")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { clientId, title, description, category, priority, assignedToId } = body;

    if (!clientId || !title || !category) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const newTask = await db.insert(tasks).values({
      clientId,
      title,
      description,
      category,
      priority: priority || "MEDIUM",
      createdById: session.user.id,
      assignedToId,
    }).returning();

    // Log activity
    await db.insert(activityLogs).values({
      taskId: newTask[0].id,
      userId: session.user.id,
      activityType: "TASK_CREATED",
      description: `Task created: ${title}`,
    });

    return NextResponse.json(newTask[0], { status: 201 });
  } catch (error) {
    console.error("Error creating task:", error);
    return NextResponse.json(
      { error: "Failed to create task" },
      { status: 500 }
    );
  }
}
