import * as React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  glow?: boolean;
}

export function Card({ hover = true, glow = false, className = "", children, ...props }: CardProps) {
  return (
    <div
      className={`rounded-2xl border p-6 transition-all duration-200
        bg-[var(--card-bg)] border-[var(--border)]
        ${hover ? "hover:border-crimson hover:shadow-glow" : ""}
        ${glow ? "shadow-glow border-crimson/30" : ""} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className = "", children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`flex flex-col gap-1.5 mb-4 ${className}`} {...props}>{children}</div>;
}

export function CardTitle({ className = "", children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={`text-lg font-semibold font-display tracking-tight text-[var(--text-primary)] ${className}`} {...props}>{children}</h3>;
}

export function CardDescription({ className = "", children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={`text-sm text-[var(--text-secondary)] ${className}`} {...props}>{children}</p>;
}

export function CardContent({ className = "", children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={className} {...props}>{children}</div>;
}
