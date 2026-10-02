import { Component, type ErrorInfo, type ReactNode } from "react";
import { EmptyState } from "./EmptyState";

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
 * The fallback reuses the live EmptyState treatment.
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
      <div className="min-h-screen bg-black flex items-center justify-center">
        <EmptyState
          icon="AlertCircle"
          title="This screen ran into a problem"
          message="You can go back. The rest of SEEN is still available."
          actionLabel="Back to For You"
          onAction={this.handleReset}
        />
      </div>
    );
  }
}
