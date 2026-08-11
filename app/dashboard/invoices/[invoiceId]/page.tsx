import { db } from '@/app/config/db';
import { Customers, Invoices } from '@/app/config/schema';
import { auth } from '@clerk/nextjs/server';
import { and, eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import React from 'react'
import InvoiceInfo from './_components/InvoiceInfo';

export default async function Page({ params }: { params: Promise<{ invoiceId: string }> }) {

    const { userId } = await auth();
    if (!userId) return notFound();



    const { invoiceId: rawId } = await params;
    const invoiceId = parseInt(rawId);

    if (isNaN(invoiceId)) {
        return <div>Invalid Invoice ID</div>
    }

    const [result] = await db.select()
        .from(Invoices)
        .innerJoin(Customers, eq(Invoices.customerId, Customers.id))
        .where(
            and(
                eq(Invoices.id, invoiceId),
                eq(Invoices.userId, userId)
            )
        )
        .limit(1);

    if (!result) {
        return notFound();
    }

    const { invoices: invoice, customers: customer } = result;

    return (
        <InvoiceInfo invoice={invoice} customer={customer} />
    )
}