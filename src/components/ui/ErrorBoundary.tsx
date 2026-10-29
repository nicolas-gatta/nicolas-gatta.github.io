import { Component, type ErrorInfo, type ReactNode } from 'react';
export default class ErrorBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(
      'This experience could not open.',
      error,
      info.componentStack
    );
  }
  render() {
    if (this.state.failed)
      return (
        <div className="page-shell" style={{ paddingBlock: 100 }}>
          <p className="eyebrow">A small interruption</p>
          <h1 className="section-heading">Let’s try that again.</h1>
          <p className="muted">
            This experience could not open. Your CV and contact details are
            still available.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <button
              className="button button-primary"
              onClick={() => window.location.reload()}
            >
              Reload page
            </button>
            <a
              className="button"
              href={`${import.meta.env.BASE_URL}cv/Nicolas_Gatta_CV.pdf`}
            >
              Open CV PDF
            </a>
            <a className="button" href="mailto:nicolasgatta1@gmail.com">
              Email Nicolas
            </a>
          </div>
        </div>
      );
    return this.props.children;
  }
}
