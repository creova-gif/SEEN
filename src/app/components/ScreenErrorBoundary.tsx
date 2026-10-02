import { Component, type ErrorInfo, type ReactNode } from "react";

interface ScreenErrorBoundaryProps {
  children: ReactNode;
  resetKey?: string;
  onReset?: () => void;
}

interface ScreenErrorBoundaryState {
  error: Error | null;
}

/**
 * Keeps a single screen failure from unmounting the rest of the app.
 * Visual treatment matches the live SEEN screens: black, Inter, white-alpha
 * text, and the existing pill button. No shadows.
 */
export class ScreenErrorBoundary extends Component<
  ScreenErrorBoundaryProps,
  ScreenErrorBoundaryState
> {
  state: ScreenErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ScreenErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("[ScreenErrorBoundary]", error, info);
  }

  componentDidUpdate(prevProps: ScreenErrorBoundaryProps) {
    if (this.state.error && prevProps.resetKey !== this.props.resetKey) {
      this.setState({ error: null });
    }
  }

  private handleReset = () => {
    this.setState({ error: null });
    this.props.onReset?.();
  };

  render() {
    if (!this.state.error) {
      return this.props.children;
    }

    return (
      <div
        className="min-h-screen bg-black flex items-center justify-center px-6"
        style={{
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        }}
      >
        <div className="max-w-sm text-center">
          <h1 className="text-xl font-semibold text-white mb-3">
            This screen ran into a problem
          </h1>
          <p className="text-sm text-white/60 leading-relaxed mb-8">
            You can go back. The rest of SEEN is still available.
          </p>
          <button
            type="button"
            onClick={this.handleReset}
            className="px-6 py-3 bg-white text-black rounded-full text-sm font-medium hover:bg-white/90 transition-colors"
          >
            Back to For You
          </button>
        </div>
      </div>
    );
  }
}
