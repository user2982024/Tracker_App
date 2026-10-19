import { Component } from "react";

class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    if (import.meta.env.DEV) {
      console.error("Application render error:", error, info);
    }
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-6 text-foreground">
        <section
          className="w-full max-w-md rounded-2xl border border-border bg-surface p-8 text-center shadow-lg"
          role="alert"
        >
          <h1 className="text-xl font-semibold">We couldn’t load this page</h1>
          <p className="mt-3 text-sm text-foreground-muted">
            Something went wrong. Please try again.
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-6 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
          >
            Try again
          </button>
        </section>
      </main>
    );
  }
}

export default ErrorBoundary;
