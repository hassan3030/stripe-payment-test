import { db } from "@/app/config/db";
import { Customers } from "@/app/config/schema";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

export async function POST(request: Request) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { email, name } = await request.json();
  
  // Check if user exists
  const existingUser = await db
    .select()
    .from(Customers)
    .where(eq(Customers.email, email));

  if (existingUser.length > 0) {
    console.log("User already exists:", existingUser);
    return NextResponse.json({ 
      message: "User already exists", 
      customer: existingUser[0] 
    }, { status: 200 });  // Changed to 200 since it's not really an error
  }

  // Create new customer
  const customer = await db
    .insert(Customers)
    .values({
      email,
      name,
      userId,
    })
    .returning();

  console.log("Customer created:", customer);
  return NextResponse.json(customer[0]);
}