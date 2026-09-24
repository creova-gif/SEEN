import { Component, type ErrorInfo, type ReactNode } from "react";
import { reportError } from "../observability";
import { StateTemplate } from "./seen/primitives";

/**
 * Last line of defence: a render crash anywhere shows a recoverable SEEN
 * error state (with a reference id testers can quote) instead of a blank page.
 */
export class ErrorBoundary extends Component<{ children: ReactNode }, { errorId: string | null }> {
  state = { errorId: null as string | null };

  static getDerivedStateFromError() {
    return { errorId: "pending" };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    this.setState({ errorId: reportError(error, `render:${info.componentStack?.split("\n")[1]?.trim() ?? "unknown"}`) });
  }

  render() {
    if (!this.state.errorId) return this.props.children;
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-5">
        <div className="max-w-[428px] w-full">
          <StateTemplate
            kind="error"
            title="Something broke on this screen"
            message={`Your saved stories and progress are safe. Go back to For You to keep going. Reference: ${this.state.errorId}`}
            actionLabel="Back to For You"
            onAction={() => {
              window.location.hash = "#/for-you";
              window.location.reload();
            }}
          />
        </div>
      </div>
    );
  }
}
