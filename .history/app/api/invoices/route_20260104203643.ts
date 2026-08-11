import { NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { db } from "@/app/config/db";
import { Customers, Invoices } from "@/app/config/schema";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { billingName, billingEmail, value, description } = body;

  // 🔍 جيب customer
  const customer = await db
    .select()
    .from(Customers)
    .where(eq(Customers.userId, userId));

  if (customer.length === 0) {
    return NextResponse.json(
      { error: "Customer not found" },
      { status: 400 }
    );
  }

  const customerId = customer[0].id;

  // 🧾 إنشاء الفاتورة
  const invoice = await db.insert(Invoices).values({
    value,
    description,
    userId,
    customerId,
    status: "open",
  }).returning();

  return NextResponse.json(invoice[0], { status: 201 });
}
