"use client"
import React, { useOptimistic, useRef } from 'react'
import { Badge, badgeVariants } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, DownloadIcon } from '@phosphor-icons/react';
import Link from 'next/link';
import { useReactToPrint } from 'react-to-print';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { IconChevronDown } from '@tabler/icons-react';
import { updateStatus } from '@/app/actions';
import { toast } from 'sonner';

interface InvoiceInfoProps {
    invoice: {
        id: number;
        createTs: Date;
        value: number;
        description: string;
        status: "open" | "paid" | "void" | "uncollectible";
    };
    customer: {
        name: string;
        email: string;
    };
}

export default function InvoiceInfo({ invoice, customer }: InvoiceInfoProps) {
    const contentRef = useRef<HTMLDivElement>(null);
    const [optimisticStatus, addOptimisticStatus] = useOptimistic(
        invoice.status,
        (state, newStatus: "open" | "paid" | "void" | "uncollectible") => {
            return newStatus;
        }
    )

    const handlePrint = useReactToPrint({
        contentRef: contentRef
    });

    const statusColors = {
        open: "bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-300",
        paid: "bg-green-100 text-green-800 hover:bg-green-200 border-green-300",
        void: "bg-gray-100 text-gray-800 hover:bg-gray-200 border-gray-300",
        uncollectible: "bg-red-100 text-red-800 hover:bg-red-200 border-red-300",
    };

    const handleStatusChange = async (status: "open" | "paid" | "void" | "uncollectible") => {
        addOptimisticStatus(status);
        try {
            await updateStatus(invoice.id, status);
            toast.success("Status updated successfully");
        } catch (error) {
            addOptimisticStatus(invoice.status);
            toast.error("Failed to update status");
        }
    }

    return (
        <div className='container mx-auto py-10 max-w-4xl'>
            <div className='mb-6'>
                <div>
                    <Link href="/dashboard" className="flex items-center text-sm text-gray-500 hover:text-gray-900 transition-colors mb-4">

                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Dashboard
                    </Link>
                </div>

                <div className='flex justify-between items-start'>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Invoice #{invoice.id}</h1>
                        <p className="text-gray-500 mt-2">
                            Created on {invoice.createTs.toLocaleDateString()}
                        </p>
                    </div>
                    <div>
                        <DropdownMenu>
                            <DropdownMenuTrigger className={badgeVariants({ variant: "outline", className: `text-md px-3 py-1 cursor-pointer flex items-center gap-2 capitalize ${statusColors[optimisticStatus]}` })}>
                                {optimisticStatus} <IconChevronDown className="w-4 h-4" />


                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                {Object.keys(statusColors).map((status) => (
                                    <DropdownMenuItem
                                        key={status}
                                        className='uppercase cursor-pointer'
                                        onClick={() => handleStatusChange(status as "open" | "paid" | "void" | "uncollectible")}
                                    >
                                        {status}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>


                        </DropdownMenu>
                    </div>
                </div>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6" ref={contentRef}>
                    {/* Main Invoice Details */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Invoice Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <h3 className="text-sm font-medium text-gray-500">Description</h3>
                                <p className="mt-1 text-lg">{invoice.description}</p>
                            </div>
                            <Separator />
                            <div className="flex justify-between items-center">
                                <h3 className="text-sm font-medium text-gray-500">Total Amount</h3>
                                <p className="text-2xl font-bold">${invoice.value.toFixed(2)}</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Customer Details Sidebar */}
                <div className="md:col-span-1" >
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Customer</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Name</h3>
                                <p className="mt-1 font-medium">{customer.name}</p>
                            </div>
                            <div>
                                <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Email</h3>
                                <p className="mt-1 break-all">{customer.email}</p>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="mt-6 flex flex-col gap-2">
                        <Button className="w-full" variant="outline" onClick={() => handlePrint()}>
                            <DownloadIcon className='w-4 h-4 mr-2' />
                            Download PDF</Button>

                        {invoice.status === 'open' && (

                            <Link href={`/dashboard/invoices/${invoice.id}/payment`}>
                                <Button className="w-full">Pay Invoice</Button>
                            </Link>
                        )}

                    </div>
                </div>
            </div>
        </div>
    )
}
