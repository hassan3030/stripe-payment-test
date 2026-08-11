import { db } from "@/app/config/db";
import { Customers, Invoices } from "@/app/config/schema";
import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json();
  const { billingName, billingEmail, value, description, status } = body;

  let customerId;

  const existingCustomer = await db
    .select()
    .from(Customers)
    .where(and(eq(Customers.userId, userId), eq(Customers.email, billingEmail)))
    .limit(1);

  if (existingCustomer.length > 0) {
    customerId = existingCustomer[0].id;
  } else {
    // Create new customer
    const newCustomer = await db.insert(Customers).values({
      name: billingName,
      email: billingEmail,
      userId: userId,
    }).returning();
    customerId = newCustomer[0].id;
  }


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




  const invoice = await db.insert(Invoices).values({
    value,
    description,
    userId,
    customerId,
    status: status || "open",
  }).returning();


  return NextResponse.json(invoice[0], { status: 201 });


}
