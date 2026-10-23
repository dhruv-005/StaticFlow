import * as React from "react";
import Link from "next/link";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: { label: string; href?: string; onClick?: () => void };
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="card-static text-center py-16 px-6">
      {icon && (
        <div className="w-14 h-14 rounded-2xl bg-crimson-soft flex items-center justify-center mx-auto mb-4 text-crimson">
          {icon}
        </div>
      )}
      <h3 className="font-display text-lg font-semibold text-[var(--text-primary)] mb-2">
        {title}
      </h3>
      <p className="text-sm text-[var(--text-secondary)] max-w-sm mx-auto mb-6">
        {description}
      </p>
      {action && (
        action.href ? (
          <Link href={action.href} className="btn-primary btn-sm">{action.label}</Link>
        ) : (
          <button onClick={action.onClick} className="btn-primary btn-sm">{action.label}</button>
        )
      )}
    </div>
  );
}

export function ErrorState({ title = "Something went wrong", description = "Please try again later.", onRetry }: {
  title?: string; description?: string; onRetry?: () => void;
}) {
  return (
    <EmptyState
      icon={
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" />
        </svg>
      }
      title={title}
      description={description}
      action={onRetry ? { label: "Try Again", onClick: onRetry } : undefined}
    />
  );
}
