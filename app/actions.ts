"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "./config/db";
import { Invoices, Customers } from "./config/schema";
import Stripe from "stripe";
// platform to check developer send emails to customers when invoice is paid
import { Resend } from 'resend';
import InvoicePaidEmail from "@/components/email/invoice-paid-email";
//
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
//
const resend = new Resend(process.env.RESEND_API_KEY);
export async function updateStatus(id: number, status: "open" | "paid" | "void" | "uncollectible") {
    await db.update(Invoices).set({ status }).where(eq(Invoices.id, id));

    if (status === 'paid') {
        const [result] = await db.select({
            invoice: Invoices,
            customer: Customers
        }).from(Invoices)
            .innerJoin(Customers, eq(Invoices.customerId, Customers.id))
            .where(eq(Invoices.id, id))
            .limit(1);

        if (result && result.customer.email) {
            try {
                await resend.emails.send({
                    from: 'Invoice App <onboarding@resend.dev>',
                    to: result.customer.email,
                    subject: `Payment Received - Invoice #${id}`,
                    react: InvoicePaidEmail({
                        invoiceId: id.toString(),
                        amount: `$${result.invoice.value.toFixed(2)}`,
                        date: new Date().toLocaleDateString(),
                        customerName: result.customer.name

                    })
                })
            } catch (error) {
                console.error('Failed to send email:', error);
            }
        }
    }
    revalidatePath(`/dashboard/invoices/${id}`, "page");
}

// explain function createPayment: 
// This function is responsible for creating a payment session for a specific invoice using Stripe's Checkout API. 
// It takes an invoiceId as an argument, retrieves the corresponding invoice and customer details from the database,
//  and then creates a Stripe checkout session with the invoice details. 
// The function returns the URL of the created checkout session,
//  which can be used to redirect the user to complete the payment. If the invoice is not found, it throws an error.
export async function createPayment(invoiceId: number) {
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
 // from stripe documentation: https://stripe.com/docs/payments/checkout/accept-a-payment?platform=web&ui=checkout
// is static schema for creating a checkout session, it includes payment method types, line items with price data, mode of payment, success and cancel URLs, customer email, and metadata. The unit amount is multiplied by 100 to convert dollars to cents as Stripe expects amounts in the smallest currency unit.
 const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'], // any method (visa , mastercard, amex, etc.) that stripe supports
        line_items: [
            {
                price_data: {
                    currency: 'usd', // local currency for the payment
                    product_data: { // product data for the line item
                        name: `Invoice #${invoice.id}`,
                        description: invoice.description,
                    },
                    unit_amount: invoice.value * 100, // amount in cents (Stripe expects amounts in the smallest currency unit)
                },
                quantity: 1, // quantity of the line item (in this case, 1 since it's a single invoice)
            },
        ],
        mode: 'payment', // mode of the checkout session (payment, subscription, or setup)
        // success and cancel URLs for redirecting the user after payment completion or cancellation
        success_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/dashboard/invoices/${invoiceId}/payment?status=success`,
        // cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/dashboard/invoices/${invoiceId}/payment?status=canceled`,
        cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/dashboard/invoices/${invoiceId}/payment?status=canceled`,
        // customer email for sending payment confirmation and receipts
        customer_email: customer.email,
        metadata: {
            invoiceId: invoiceId.toString(),
        },
    });

    return session.url;

}