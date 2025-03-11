"use client"

import * as React from "react"
import * as SeparatorPrimitive from "@radix-ui/react-separator"

function Separator({
  className = "",
  orientation = "horizontal",
  decorative = true,
  ...props
}: React.ComponentProps<typeof SeparatorPrimitive.Root>) {
  return (
    <SeparatorPrimitive.Root
      decorative={decorative}
      orientation={orientation}
      className={`bg-gray-200 dark:bg-gray-700 shrink-0 
      ${orientation === "horizontal" ? "h-px w-full" : "h-full w-px"} 
      ${className}`}
      {...props}
    />
  )
}

export { Separator }
