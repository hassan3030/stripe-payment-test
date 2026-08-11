"use client"
import React, { useEffect } from 'react'
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
import { PlusIcon } from '@phosphor-icons/react'
import Link from 'next/link'
import { auth } from '@clerk/nextjs/server'
import { db } from '../config/db'
import { Customers } from '../config/schema'
import { eq } from 'drizzle-orm'
import { useUser } from '@clerk/nextjs'
import axios from "axios"
  const invoices = [
    {
      invoice: "INV001",
      paymentStatus: "Paid",
      totalAmount: "$250.00",
      paymentMethod: "Credit Card",
    },
    {
      invoice: "INV002",
      paymentStatus: "Pending",
      totalAmount: "$150.00",
      paymentMethod: "PayPal",
    },
    {
      invoice: "INV003",
      paymentStatus: "Unpaid",
      totalAmount: "$350.00",
      paymentMethod: "Bank Transfer",
    },
    {
      invoice: "INV004",
      paymentStatus: "Paid",
      totalAmount: "$450.00",
      paymentMethod: "Credit Card",
    },
    {
      invoice: "INV005",
      paymentStatus: "Paid",
      totalAmount: "$550.00",
      paymentMethod: "PayPal",
    },
    {
      invoice: "INV006",
      paymentStatus: "Pending",
      totalAmount: "$200.00",
      paymentMethod: "Bank Transfer",
    },
    {
      invoice: "INV007",
      paymentStatus: "Unpaid",
      totalAmount: "$300.00",
      paymentMethod: "Credit Card",
    },
  ]
 

      
    
      
      export async function Dashboard() {

        const {user} = useUser()

        useEffect(()=>{
            user&&createNewUser()
        },[user])
    
        const createNewUser=async()=>{
                const result = await axios.post("/api/user",{
                   name: user?.fullName,  
                   email:user?.primaryEmailAddress?.emailAddress  
                })
    
                console.log(result.data)

        
        return (
            <div className='p-4'>
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
                <TableHead className="w-[100px]">Invoice</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Method</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((invoice) => (
                <TableRow key={invoice.invoice}>
                  <TableCell className="font-medium">{invoice.invoice}</TableCell>
                  <TableCell>{invoice.paymentStatus}</TableCell>
                  <TableCell>{invoice.paymentMethod}</TableCell>
                  <TableCell className="text-right">{invoice.totalAmount}</TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={3}>Total</TableCell>
                <TableCell className="text-right">$2,500.00</TableCell>
              </TableRow>
            </TableFooter>
          </Table>
          </div>
        )
      }
    }

export default Dashboard