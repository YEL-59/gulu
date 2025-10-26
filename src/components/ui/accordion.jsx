"use client"

import * as React from "react"
import * as AccordionPrimitive from "@radix-ui/react-accordion"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

function Accordion({ className, ...props }) {
  return (
    <AccordionPrimitive.Root
      data-slot="accordion"
      className={cn("w-full", className)}
      {...props}
    />
  )
}

function AccordionItem({ className, ...props }) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn("border rounded-md overflow-hidden", className)}
      {...props}
    />
  )
}

function AccordionTrigger({ className, children, ...props }) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          "flex flex-1 items-center justify-between gap-3 bg-gray-100 px-4 py-3 text-sm font-medium hover:bg-gray-200 transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          className
        )}
        {...props}
      >
        {children}
        <ChevronDown className="size-4 shrink-0 transition-transform duration-200 data-[state=open]:rotate-180" />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  )
}

function AccordionContent({ className, ...props }) {
  return (
    <AccordionPrimitive.Content
      data-slot="accordion-content"
      className={cn(
        "bg-white px-4 py-3 text-sm text-gray-700 data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down",
        className
      )}
      {...props}
    />
  )
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }