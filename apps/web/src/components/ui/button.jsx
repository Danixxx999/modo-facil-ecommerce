import React from "react";
import { cn } from "@/lib/utils";
const Button = React.forwardRef(({ className, children, ...props }, ref) => (
  <button ref={ref} className={cn("inline-flex h-9 items-center justify-center rounded-md px-4 text-sm font-medium", className)} {...props}>{children}</button>
));
Button.displayName = "Button";
const buttonVariants = () => "";
export { Button, buttonVariants };
