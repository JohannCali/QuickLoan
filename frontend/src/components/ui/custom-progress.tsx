
import * as React from "react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface CustomProgressProps {
  value: number;
  className?: string;
  indicatorClassName?: string;
}

export const CustomProgress = ({
  value,
  className,
  indicatorClassName,
}: CustomProgressProps) => {
  return (
    <div className={cn("relative w-full", className)}>
      <Progress value={value} className="w-full" />
      {indicatorClassName && (
        <div
          className={cn("absolute top-0 h-full", indicatorClassName)}
          style={{ width: `${value}%` }}
        />
      )}
    </div>
  );
};
