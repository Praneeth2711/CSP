import * as React from "react";
import { cn } from "../utils";

export interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg";
}

export const Spinner: React.FC<SpinnerProps> = ({ className, size = "md", ...props }) => {
  const sizes = {
    sm: "h-5 w-5",
    md: "h-8 w-8",
    lg: "h-12 w-12"
  };

  return (
    <div className={cn("flex justify-center items-center", className)} {...props}>
      <svg
        className={cn("animate-spin text-emerald-600", sizes[size])}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    </div>
  );
};

export const CardSkeleton: React.FC = () => {
  return (
    <div className="w-full bg-white border border-slate-100 rounded-2xl p-6 space-y-4 animate-pulse shadow-sm shadow-slate-100/50">
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 bg-slate-100 rounded-xl" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-slate-100 rounded w-1/3" />
          <div className="h-3 bg-slate-100 rounded w-1/4" />
        </div>
      </div>
      <div className="space-y-2 pt-2">
        <div className="h-3 bg-slate-100 rounded w-full" />
        <div className="h-3 bg-slate-100 rounded w-5/6" />
      </div>
      <div className="flex justify-between items-center pt-4 border-t border-slate-50">
        <div className="h-4 bg-slate-100 rounded w-20" />
        <div className="h-8 bg-slate-100 rounded-lg w-24" />
      </div>
    </div>
  );
};

export const PageLoader: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
      <Spinner size="lg" />
      <p className="text-sm font-medium text-slate-500 animate-pulse">Loading content...</p>
    </div>
  );
};
