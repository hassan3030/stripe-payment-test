"use client";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "@phosphor-icons/react";
import Link from "next/link";

const invoices = [
  { invoice: "INV001", paymentStatus: "Paid", totalAmount: "$250", paymentMethod: "Credit Card" },
  { invoice: "INV002", paymentStatus: "Pending", totalAmount: "$150", paymentMethod: "PayPal" },
];

export default function DashboardClient() {
  return (
    <div className="p-4">
      <div className="flex justify-between items-center mt-10">
        <h1 className="text-3xl font-bold">Invoices</h1>
        <Link href="/dashboard/invoices/new">
          <Button>
            <PlusIcon className="w-4 h-4 mr-2" />
            Add Invoice
          </Button>
        </Link>
      </div>

      <Table>
        <TableCaption>A list of your recent invoices.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Invoice</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Method</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {invoices.map((invoice) => (
            <TableRow key={invoice.invoice}>
              <TableCell>{invoice.invoice}</TableCell>
              <TableCell>{invoice.paymentStatus}</TableCell>
              <TableCell>{invoice.paymentMethod}</TableCell>
              <TableCell className="text-right">{invoice.totalAmount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
