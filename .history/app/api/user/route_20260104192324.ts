import { db } from "@/app/config/db";
import { Customers } from "@/app/config/schema";
import { NextResponse } from "next/server";

export async function POST(request: Request) {

    const { email, name } = await request.json();
    const user = await db.insert(Customers).values({
        email,
        name,
    });
    return NextResponse.json(user);

7
}