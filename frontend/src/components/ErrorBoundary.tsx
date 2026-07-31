import React, { Component, type ErrorInfo, type ReactNode } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  handleRetry = (): void => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "60vh",
            padding: "32px",
          }}
        >
          <div
            style={{
              maxWidth: "480px",
              width: "100%",
              textAlign: "center",
              padding: "48px 32px",
              background: "var(--surface)",
              border: "1px solid var(--line)",
              borderRadius: "20px",
              boxShadow: "var(--shadow-md, 0 8px 30px rgba(0,0,0,0.12))",
            }}
          >
            <div
              style={{
                fontSize: "3rem",
                marginBottom: "16px",
                lineHeight: 1,
              }}
              aria-hidden="true"
            >
              ⚠️
            </div>

            <h2
              style={{
                margin: "0 0 12px 0",
                fontSize: "1.35rem",
                color: "var(--text)",
                fontWeight: 700,
              }}
            >
              Something went wrong
            </h2>

            <p
              style={{
                margin: "0 0 16px 0",
                color: "var(--text-muted)",
                fontSize: "0.92rem",
                lineHeight: 1.5,
              }}
            >
              An unexpected error occurred. You can try reloading the page.
            </p>

            {this.state.error && (
              <code
                style={{
                  display: "block",
                  padding: "12px 16px",
                  borderRadius: "10px",
                  background: "rgba(239, 68, 68, 0.08)",
                  border: "1px solid rgba(239, 68, 68, 0.2)",
                  color: "var(--accent, #ef4444)",
                  fontSize: "0.8rem",
                  wordBreak: "break-word",
                  textAlign: "left",
                  marginBottom: "24px",
                  maxHeight: "120px",
                  overflow: "auto",
                }}
              >
                {this.state.error.message}
              </code>
            )}

            <button
              onClick={this.handleRetry}
              style={{
                padding: "12px 32px",
                borderRadius: "50px",
                border: "none",
                background: "var(--primary)",
                color: "#ffffff",
                fontWeight: 600,
                fontSize: "0.95rem",
                cursor: "pointer",
                transition: "transform 0.15s ease",
              }}
              onMouseOver={(e) => {
                (e.target as HTMLButtonElement).style.transform = "scale(1.04)";
              }}
              onMouseOut={(e) => {
                (e.target as HTMLButtonElement).style.transform = "scale(1)";
              }}
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
