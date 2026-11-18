import { Component } from 'react';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

/**
 * The runtime fallback screen.
 *
 * A class boundary is the only way to catch an error thrown by a child, but it
 * cannot read context — hence the small function component below that pulls the
 * copy out of the language provider and hands it to the boundary as a prop.
 */
function ErrorCopy() {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-primary-text dark:text-primary-text-dark">
      <div className="text-center max-w-md">
        <div className="mb-6 flex justify-center">
          <div className="w-16 h-16 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center">
            <AlertTriangle size={28} className="text-accent" />
          </div>
        </div>

        <span className="font-josefin text-[10px] font-bold tracking-[0.3em] text-accent uppercase mb-4 block">
          {t('error.code')}
        </span>

        <h1 className="text-3xl font-bold font-editorial tracking-tight mb-4">{t('error.title')}</h1>

        <p className="text-base text-primary-text/60 dark:text-primary-text-dark/60 font-host mb-10 leading-relaxed">
          {t('error.body')}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-primary-text dark:text-primary-text-dark text-white dark:text-[#1C1C1D] rounded-xl font-host font-bold tracking-widest uppercase text-xs transition-all duration-300 cursor-pointer active:scale-[0.98] hover:-translate-y-0.5"
          >
            <RotateCcw size={14} />
            {t('error.reload')}
          </button>

          <button
            onClick={() => window.location.assign('/')}
            className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-transparent text-primary-text dark:text-primary-text-dark border border-primary-text/30 dark:border-primary-text-dark/30 rounded-xl font-host font-bold tracking-widest uppercase text-xs hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-300 cursor-pointer active:scale-[0.98]"
          >
            <Home size={14} />
            {t('error.home')}
          </button>
        </div>
      </div>
    </div>
  );
}

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

  render() {
    if (this.state.hasError) {
      return (
        <div className="bg-background dark:bg-background-dark">
          <ErrorCopy />
        </div>
      );
    }

    return this.props.children;
  }
}