import * as React from "react"

function Input({ className = "", type = "text", ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      className={`border border-gray-300 dark:border-gray-700 bg-transparent text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 
      selection:bg-blue-500 selection:text-white 
      flex h-9 w-full rounded-md px-3 py-1 text-base shadow-xs outline-none transition 
      focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
      disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 
      file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium 
      md:text-sm 
      ${className}`}
      {...props}
    />
  )
}

export { Input }
