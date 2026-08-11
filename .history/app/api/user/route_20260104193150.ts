import { db } from "@/app/config/db";
import { Customers } from "@/app/config/schema";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function POST(request: Request) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { email, name } = await request.json();

  const customer = await db
    .insert(Customers)
    .values({
      email,
      name,
      userId,
    })
    .returning();

  return NextResponse.json(customer);
}
