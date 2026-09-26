import * as React from "react";
import { cn } from "@/lib/utils";
const Input = React.forwardRef(({ className, type = "text", ...props }, ref) => (
  <input ref={ref} type={type} className={cn("flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring disabled:opacity-50", className)} {...props} />
));
Input.displayName = "Input";
export { Input };
