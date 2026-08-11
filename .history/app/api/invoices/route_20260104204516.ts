import { db } from "@/app/config/db";
import { Customers, Invoices } from "@/app/config/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const { userId } = await auth();
    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      const body = await req.json();
      const { billingName, billingEmail, value, description } = body;

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


      const invoice = await db.insert(Invoices).values({
        value,
        description,
        userId,
        customerId,
        status: "open",
      }).returning();

      
  return NextResponse.json(invoice[0], { status: 201 });


}
