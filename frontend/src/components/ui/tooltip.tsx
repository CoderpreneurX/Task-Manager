"use client";

import * as React from "react";
import { useState } from "react";

function TooltipProvider({ children }: { children: React.ReactNode }) {
  return <div className="relative">{children}</div>;
}

function Tooltip({ children }: { children: React.ReactNode }) {
  return <TooltipProvider>{children}</TooltipProvider>;
}

function TooltipTrigger({ children }: { children: React.ReactNode }) {
  return <div className="inline-block">{children}</div>;
}

function TooltipContent({
  className = "",
  children,
  side = "top",
}: {
  className?: string;
  children: React.ReactNode;
  side?: "top" | "bottom" | "left" | "right";
}) {
  const [visible, setVisible] = useState(false);

  const positionClasses = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      {visible && (
        <div
          className={`absolute z-50 w-fit max-w-xs rounded-md bg-primary text-primary-foreground px-3 py-1.5 text-xs shadow-lg transition-opacity duration-200 opacity-100 ${positionClasses[side]} ${className}`}
        >
          Tooltip content here
          <div
            className={`absolute bg-primary w-2.5 h-2.5 rotate-45 ${side === "top" ? "bottom-[-4px] left-1/2 -translate-x-1/2" : ""} ${side === "bottom" ? "top-[-4px] left-1/2 -translate-x-1/2" : ""} ${side === "left" ? "right-[-4px] top-1/2 -translate-y-1/2" : ""} ${side === "right" ? "left-[-4px] top-1/2 -translate-y-1/2" : ""}`}
          />
        </div>
      )}
    </div>
  );
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
