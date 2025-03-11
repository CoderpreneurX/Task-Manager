"use client"

import * as React from "react"
import * as SheetPrimitive from "@radix-ui/react-dialog"
import { XIcon } from "lucide-react"

function Sheet({ ...props }: React.ComponentProps<typeof SheetPrimitive.Root>) {
  return <SheetPrimitive.Root {...props} />
}

function SheetTrigger({ ...props }: React.ComponentProps<typeof SheetPrimitive.Trigger>) {
  return <SheetPrimitive.Trigger {...props} />
}

function SheetClose({ ...props }: React.ComponentProps<typeof SheetPrimitive.Close>) {
  return <SheetPrimitive.Close {...props} />
}

function SheetPortal({ ...props }: React.ComponentProps<typeof SheetPrimitive.Portal>) {
  return <SheetPrimitive.Portal {...props} />
}

function SheetOverlay({ className = "", ...props }: React.ComponentProps<typeof SheetPrimitive.Overlay>) {
  return (
    <SheetPrimitive.Overlay
      className={`fixed inset-0 z-50 bg-black/80 transition-opacity ${className}`}
      {...props}
    />
  )
}

function SheetContent({
  className = "",
  children,
  side = "right",
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Content> & {
  side?: "top" | "right" | "bottom" | "left"
}) {
  return (
    <SheetPortal>
      <SheetOverlay />
      <SheetPrimitive.Content
        className={`fixed z-50 flex flex-col bg-white dark:bg-gray-900 shadow-lg transition-transform 
          ${side === "right" ? "inset-y-0 right-0 h-full w-3/4 sm:max-w-sm border-l" : ""}
          ${side === "left" ? "inset-y-0 left-0 h-full w-3/4 sm:max-w-sm border-r" : ""}
          ${side === "top" ? "inset-x-0 top-0 h-auto border-b" : ""}
          ${side === "bottom" ? "inset-x-0 bottom-0 h-auto border-t" : ""}
          ${className}`}
        {...props}
      >
        {children}
        <SheetPrimitive.Close className="absolute top-4 right-4 opacity-70 hover:opacity-100 focus:ring-2 focus:ring-blue-500 rounded-md transition-opacity">
          <XIcon className="w-4 h-4" />
          <span className="sr-only">Close</span>
        </SheetPrimitive.Close>
      </SheetPrimitive.Content>
    </SheetPortal>
  )
}

function SheetHeader({ className = "", ...props }: React.ComponentProps<"div">) {
  return <div className={`p-4 flex flex-col gap-1.5 ${className}`} {...props} />
}

function SheetFooter({ className = "", ...props }: React.ComponentProps<"div">) {
  return <div className={`mt-auto p-4 flex flex-col gap-2 ${className}`} {...props} />
}

function SheetTitle({ className = "", ...props }: React.ComponentProps<typeof SheetPrimitive.Title>) {
  return <SheetPrimitive.Title className={`text-lg font-semibold ${className}`} {...props} />
}

function SheetDescription({ className = "", ...props }: React.ComponentProps<typeof SheetPrimitive.Description>) {
  return <SheetPrimitive.Description className={`text-sm text-gray-500 dark:text-gray-400 ${className}`} {...props} />
}

export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
}
