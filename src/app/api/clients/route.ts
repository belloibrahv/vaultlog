import { auth } from "@/auth";
import { db } from "@/db";
import { clients } from "@/db/schema";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const allClients = await db.query.clients.findMany({
      with: {
        tasks: true,
      },
    });

    return NextResponse.json(allClients);
  } catch (error) {
    console.error("Error fetching clients:", error);
    return NextResponse.json(
      { error: "Failed to fetch clients" },
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
    const { name, description, status } = body;

    if (!name) {
      return NextResponse.json(
        { error: "Name is required" },
        { status: 400 }
      );
    }

    const newClient = await db
      .insert(clients)
      .values({
        name,
        description,
        status: status || "ACTIVE",
      })
      .returning();

    return NextResponse.json(newClient[0], { status: 201 });
  } catch (error) {
    console.error("Error creating client:", error);
    return NextResponse.json(
      { error: "Failed to create client" },
      { status: 500 }
    );
  }
}
