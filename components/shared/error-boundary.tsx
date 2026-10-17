"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCcw, Home, Terminal } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("[StaticFlow ErrorBoundary Catch]:", error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex min-h-[400px] w-full items-center justify-center p-6">
          <div className="glass-card relative max-w-lg w-full overflow-hidden p-6 border-cyber-red/30 space-y-5">
            {/* Background Red Glow */}
            <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-cyber-red/[0.08] blur-2xl pointer-events-none" />

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyber-red/10 border border-cyber-red/30 text-cyber-red">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-cyber-white">Component Execution Fault</h3>
                <p className="text-xs text-cyber-white/40 font-mono">React lifecycle exception caught</p>
              </div>
            </div>

            {/* Error Message Box */}
            <div className="rounded-xl border border-cyber-white/10 bg-black/80 p-3.5 space-y-2 font-mono text-xs">
              <div className="flex items-center gap-1.5 text-cyber-red font-bold">
                <Terminal className="h-3.5 w-3.5" />
                <span>{this.state.error?.name || "RuntimeError"}:</span>
              </div>
              <p className="text-cyber-white/80 break-words leading-relaxed">
                {this.state.error?.message || "An unexpected rendering fault occurred."}
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => (window.location.href = "/overview")}
                className="flex items-center gap-1.5 rounded-lg border border-cyber-white/10 bg-cyber-white/5 px-3.5 py-2 text-xs font-semibold text-cyber-white/70 hover:bg-cyber-white/10 hover:text-cyber-white transition-all"
              >
                <Home className="h-3.5 w-3.5" />
                <span>Return Overview</span>
              </button>

              <button
                onClick={this.handleReset}
                className="neon-button flex items-center gap-1.5 !px-3.5 !py-2 text-xs font-bold"
              >
                <RefreshCcw className="h-3.5 w-3.5" />
                <span>Re-mount Subsystem</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
