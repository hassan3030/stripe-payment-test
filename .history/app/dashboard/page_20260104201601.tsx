import { auth } from "@clerk/nextjs/server";
import { db } from "../config/db";
import { Customers } from "../config/schema";
import { eq } from "drizzle-orm";

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    return <div>Not authenticated</div>;
  }

  const customer = await db
    .select()
    .from(Customers)
    .where(eq(Customers.userId, userId));

  if (customer.length === 0) {
    console.log("🟡 Creating new customer...");

    await db.insert(Customers).values({
      userId,
      email: "placeholder@email.com",
      name: "New User",
    });

    console.log("🟢 Customer created");
  } else {
    console.log("🟢 User already exists");
  }

  return <div>Dashboard</div>;
}
