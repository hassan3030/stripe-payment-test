import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from '@/components/ui/button'
import { PlusIcon } from '@phosphor-icons/react/dist/ssr'
import Link from 'next/link'
import { db } from '@/app/config/db'
import { Customers, Invoices } from '@/app/config/schema'
import { desc, eq } from 'drizzle-orm'
import { currentUser } from '@clerk/nextjs/server'
import UserSyncer from './_components/UserSyncer'
import { Badge } from "@/components/ui/badge"
import Header from "./_components/Header"

export default async function Dashboard() {
  const user = await currentUser();

  const result = await db.select()
    .from(Invoices)
    .innerJoin(Customers, eq(Invoices.customerId, Customers.id))
    .orderBy(desc(Invoices.id))
    .limit(10); // Limit to recent invoices for now

  const filteredResult = user ? await db.select()
    .from(Invoices)
    .innerJoin(Customers, eq(Invoices.customerId, Customers.id))
    .where(eq(Invoices.userId, user?.id))
    .orderBy(desc(Invoices.id)) : [];



  const statusColors = {
    open: "bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-300",
    paid: "bg-green-100 text-green-800 hover:bg-green-200 border-green-300",
    void: "bg-gray-100 text-gray-800 hover:bg-gray-200 border-gray-300",
    uncollectible: "bg-red-100 text-red-800 hover:bg-red-200 border-red-300",
  };




  return (
    <div className='p-4'>

      <UserSyncer />

      <div className="flex justify-between items-center  mt-10">
        <h1 className='text-3xl font-bold'>Invoices</h1>
        <Link href='/dashboard/invoices/new'>
          <Button><PlusIcon className='w-4 h-4' />    Add Invoice</Button>
        </Link>
      </div>
      <Table >
        <TableCaption>A list of your recent invoices.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="">Date</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Email</TableHead>
            <TableHead className="text-right" >Status</TableHead>
            <TableHead className="text-right">Value</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredResult.map((record) => (
            <TableRow key={record.invoices.id}>


              <TableCell className="font-medium">
                <Link href={`/dashboard/invoices/${record.invoices.id}`}>
                  {record.invoices.createTs.toLocaleDateString()}</Link></TableCell>


              <TableCell>
                <Link href={`/dashboard/invoices/${record.invoices.id}`}>
                  {record.customers.name}
                </Link>
              </TableCell>

              <TableCell>
                <Link href={`/dashboard/invoices/${record.invoices.id}`}>
                  {record.customers.email}
                </Link>
              </TableCell>

              <TableCell className="text-right">
                <Link href={`/dashboard/invoices/${record.invoices.id}`}>
                  <Badge variant={record.invoices.status === 'paid' ? 'default' : 'secondary'} className={`text-md px-3 p-4  capitalize ${statusColors[record.invoices.status]}`}>
                    {record.invoices.status}
                  </Badge>

                </Link></TableCell>
              <TableCell className="text-right">${(record.invoices.value)}</TableCell>

            </TableRow>

          ))}
        </TableBody>
      </Table>
    </div>
  )
}
