import { auth } from "@clerk/nextjs/server";
import { db } from "../config/db";
import { Customers } from "../config/schema";
import { eq } from "drizzle-orm";
import DashboardClient from "../DashboardClient";

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    console.log("❌ No user logged in");
    return <div>Not authenticated</div>;
  }

  console.log("✅ Clerk userId:", userId);

  const customer = await db
    .select()
    .from(Customers)
    .where(eq(Customers.userId, userId));

  if (customer.length === 0) {
    console.log("🟡 User NOT found in database");
  } else {
    console.log("🟢 User FOUND in database:", customer[0]);
  }

  return <DashboardClient />;
}
