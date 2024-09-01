import { AppState } from './app.state';

export function getInitialState(): Partial<AppState> {
  if (typeof window !== 'undefined' && window.localStorage) {
    const savedState = localStorage.getItem('appState');
    return savedState ? JSON.parse(savedState) : {};
  }

  return {};
}
