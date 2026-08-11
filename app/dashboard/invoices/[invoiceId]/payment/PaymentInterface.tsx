"use client"

import { createPayment, updateStatus } from '@/app/actions';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, CheckCircleIcon } from '@phosphor-icons/react';
import { IconLoader2 } from '@tabler/icons-react';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'


interface PaymentInterfaceProps {
    invoice: {
        id: number;
        value: number;
        description: string;
        status: string;
    };
    customer: {
        name: string;
        email: string;
    };
    status?: string;
}
function PaymentInterface({ invoice, customer, status }: PaymentInterfaceProps) {
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (status === "success" && invoice.status !== "paid") {


            const markPaid = async () => {
                try {

                    await updateStatus(invoice.id, 'paid');
                    console.log("Invoice marked as paid");
                } catch (err) {
                    console.error("Failed to update status", err);
                }
            };
            markPaid();
        }
    }, [status, invoice.status, invoice.id])


    const handlePay = async () => {
        try {
            setLoading(true);
            const url = await createPayment(invoice.id);
            if (url) {
                window.location.href = url;
            } else {
                setLoading(false);
            }
        } catch (e) {
            console.error(e);
            setLoading(false);
        }
    }

    if (status === "success") {
        return (
            <div className="flex justify-center items-center min-h-[50vh] p-4">
                <Card className="w-full max-w-md border-green-200 bg-green-50 shadow-sm">
                    <CardContent className="pt-6 flex flex-col items-center text-center space-y-4">
                        <CheckCircleIcon className="w-16 h-16 text-green-500" />
                        <h2 className="text-2xl font-bold text-green-700">Payment Successful!</h2>
                        <p className="text-green-600">Thank you for your payment. Your invoice has been marked as paid.</p>
                        <Link href="/dashboard">
                            <Button className="mt-4 bg-green-600 hover:bg-green-700 text-white">
                                Go to Invoices
                            </Button>
                        </Link>

                    </CardContent>
                </Card>
            </div>
        )


    }

    return (
        <div className="flex justify-center items-center min-h-[50vh] p-4">
            <Card className="w-full max-w-md shadow-lg">
                <CardHeader>
                    <div className="flex justify-between items-center mb-2">
                        <Badge variant="outline" className="text-xs font-normal text-muted-foreground">
                            Invoice #{invoice.id}
                        </Badge>
                        <Badge variant={invoice.status === 'paid' ? 'default' : 'secondary'} className="uppercase">
                            {invoice.status}
                        </Badge>
                    </div>
                    <CardTitle className="text-2xl">Invoice Payment</CardTitle>
                    <CardDescription>
                        Billed to <span className="font-medium text-foreground">{customer.name}</span>
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="p-4 bg-muted/50 rounded-lg flex justify-between items-center">
                        <span className="font-medium text-muted-foreground">Total Due</span>
                        <span className="text-3xl font-bold">${invoice.value.toFixed(2)}</span>
                    </div>
                    <div>
                        <h4 className="text-sm font-medium mb-1 text-muted-foreground">Description</h4>
                        <p className="text-sm">{invoice.description}</p>
                    </div>

                    {status === 'canceled' && (
                        <div className="p-3 bg-red-50 border border-red-100 rounded-md text-red-600 text-sm text-center">
                            Payment was canceled. Please try again.
                        </div>
                    )}
                </CardContent>
                <CardFooter>
                    <Button
                        className="w-full h-12 text-lg"

                        onClick={handlePay}
                        disabled={loading || invoice.status === 'paid'}
                    >
                        {loading && <IconLoader2 className="mr-2 h-5 w-5 animate-spin" />}
                        {invoice.status === 'paid' ? 'Paid' : 'Pay via Stripe'}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );

}

export default PaymentInterface