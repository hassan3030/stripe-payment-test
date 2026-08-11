import { updateStatus } from '@/app/actions';
import { db } from '@/app/config/db';
import { Customers, Invoices } from '@/app/config/schema';
import { auth } from '@clerk/nextjs/server';
import { eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import React from 'react'
import PaymentInterface from './PaymentInterface';

async function Page({ params, searchParams }: {
    params: Promise<{ invoiceId: string }>,
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {

    const { invoiceId: rawId } = await params;
    const invoiceId = parseInt(rawId);

    const { userId } = await auth()
    if (!userId) {
        return redirect('/sign-in')
    }



    const [result] = await db.select({
        invoice: Invoices,
        customer: Customers
    }).from(Invoices)
        .innerJoin(Customers, eq(Invoices.customerId, Customers.id))
        .where(eq(Invoices.id, invoiceId))
        .limit(1);


    if (!result) {
        throw new Error("Invoice not found");
    }
    const { invoice, customer } = result;

    const sp = await searchParams;
    const status = sp?.status as string | undefined;



    return (

        <PaymentInterface invoice={invoice} customer={customer} status={status} />
    )
}

export default Page