"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useRouter } from "next/navigation"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const formSchema = z.object({
  billingName: z.string().min(2, {
    message: "Billing name must be at least 2 characters.",
  }),
  billingEmail: z.string().email({
    message: "Please enter a valid email address.",
  }),
  value: z.number().positive({
    message: "Value must be a positive number.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }).max(160, {
    message: "Description must not be longer than 160 characters.",
  }),
  status: z.enum(["open", "paid", "void", "uncollectible"]),
})

export default function NewInvoicePage() {
  const router = useRouter()
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      billingName: "",
      billingEmail: "",
      value: 0,
      description: "",
      status: "open",
    },
  })

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    const res = await fetch("/api/invoices", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    })

    if (!res.ok) {
      console.error("Failed to create invoice");
      return;
    }
    const data = await res.json()
    toast.success("Invoice created successfully");
    console.log("Invoice created:", data);

    router.push("/dashboard")
    router.refresh();

  }

  const statuses = ["open", "paid", "void", "uncollectible"] as const;

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">Create New Invoice</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="billingName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Billing Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormDescription>
                  This is the name of the client to be billed.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="billingEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Billing Email</FormLabel>
                <FormControl>
                  <Input placeholder="john.doe@example.com" {...field} />
                </FormControl>
                <FormDescription>
                  This is the email of the client to be billed.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="value"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Value</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="100.00" {...field} onChange={event => field.onChange(parseFloat(event.target.value))} />
                </FormControl>
                <FormDescription>
                  The total value of the invoice.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Brief description of services or products..."
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  A detailed description of the invoice items.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <DropdownMenu>
                  <DropdownMenuTrigger className={buttonVariants({ variant: "outline", className: "w-full text-left uppercase" })}>
                    {field.value || "Select Status"}
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {statuses.map((status) => (
                      <DropdownMenuItem
                        key={status}
                        onSelect={() => field.onChange(status)}
                        className="uppercase"
                      >
                        {status}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
                <FormDescription>
                  The current status of the invoice.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  )
}
