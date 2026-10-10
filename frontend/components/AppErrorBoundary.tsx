import React from 'react';
import StatusScreen from './StatusScreen';
import { recoveryState } from '../lib/recoveryState.js';

export default class AppErrorBoundary extends React.Component<{ children: React.ReactNode; resetKey: string }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { console.error('JusticeHub could not render this page.'); }
  componentDidUpdate(previous: Readonly<{ children: React.ReactNode; resetKey: string }>) {
    if (this.state.failed && previous.resetKey !== this.props.resetKey) this.setState({ failed: false });
  }
  render() {
    return this.state.failed
      ? <StatusScreen state={recoveryState(new Error())} onRetry={() => window.location.reload()} />
      : this.props.children;
  }
}
