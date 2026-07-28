import { Component } from 'react';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-background dark:bg-background-dark text-primary-text dark:text-primary-text-dark">
          <div className="text-center max-w-md">
            <div className="mb-6 flex justify-center">
              <div className="w-16 h-16 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center">
                <AlertTriangle size={28} className="text-accent" />
              </div>
            </div>

            <span className="font-josefin text-[10px] font-bold tracking-[0.3em] text-accent uppercase mb-4 block">
              SH–ERR // RUNTIME_EXCEPTION
            </span>

            <h1 className="text-3xl font-bold font-editorial tracking-tight mb-4">
              Something went wrong.
            </h1>

            <p className="text-base text-primary-text/60 dark:text-primary-text-dark/60 font-host mb-10 leading-relaxed">
              An unexpected error occurred. Try reloading the page or going back to the home screen.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={this.handleReload}
                className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-primary-text dark:bg-primary-text-dark text-white dark:text-[#1C1C1D] rounded-xl font-host font-bold tracking-widest uppercase text-xs transition-all duration-300 cursor-pointer active:scale-[0.98] hover:-translate-y-0.5"
                aria-label="Reload page"
              >
                <RotateCcw size={14} />
                Reload Page
              </button>

              <button
                onClick={this.handleGoHome}
                className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-transparent text-primary-text dark:text-primary-text-dark border border-primary-text/30 dark:border-primary-text-dark/30 rounded-xl font-host font-bold tracking-widest uppercase text-xs hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-300 cursor-pointer active:scale-[0.98]"
                aria-label="Go to home page"
              >
                <Home size={14} />
                Go Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
