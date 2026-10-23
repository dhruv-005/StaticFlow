import * as React from "react";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  width?: string;
  height?: string;
  circle?: boolean;
}

export function Skeleton({ width, height, circle = false, className = "", ...props }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse bg-[var(--bg-elevated)] rounded-xl
        ${circle ? "rounded-full" : ""} ${className}`}
      style={{ width: width || "100%", height: height || "20px" }}
      {...props}
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="card-static space-y-4">
      <Skeleton height="16px" width="60%" />
      <Skeleton height="12px" width="90%" />
      <Skeleton height="12px" width="75%" />
      <div className="flex gap-3 pt-2">
        <Skeleton height="32px" width="80px" />
        <Skeleton height="32px" width="80px" />
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border)]">
          <Skeleton height="14px" width="15%" />
          <Skeleton height="14px" width="30%" />
          <Skeleton height="14px" width="20%" />
          <Skeleton height="14px" width="15%" />
          <div className="ml-auto"><Skeleton height="28px" width="60px" /></div>
        </div>
      ))}
    </div>
  );
}
