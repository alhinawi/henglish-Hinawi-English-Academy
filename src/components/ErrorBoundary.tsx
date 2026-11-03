// ==============================================================================
// Henglish Academy (HENGLISH) - PRODUCTION REACT ERROR BOUNDARY
// Prevents white-screen crashes, catches lazy-loading failures & provides friendly UI
// ==============================================================================

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[Henglish ErrorBoundary] Uncaught runtime error:', error, errorInfo);
  }

  public handleReset = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) {
      this.props.onReset();
    } else {
      window.location.reload();
    }
  };

  public handleGoHome = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[50vh] flex items-center justify-center p-6 bg-slate-900/60 rounded-2xl border border-rose-500/20 backdrop-blur-md my-8">
          <div className="max-w-md w-full text-center space-y-5">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-bold text-white">
                {this.props.fallbackTitle || 'عذراً، حدث خطأ غير متوقع'}
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                واجه النظام مشكلة مؤقتة أثناء عرض هذا القسم التعليمي. يمكنك إعادة المحاولة أو العودة إلى لوحة التحكم الرئيسية.
              </p>
            </div>

            {/* Development-only error message */}
            {!import.meta.env.PROD && this.state.error && (
              <div className="p-3 bg-slate-950/80 rounded-lg text-left border border-slate-800 text-xs text-rose-300 font-mono overflow-auto max-h-32">
                {this.state.error.message}
              </div>
            )}

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={this.handleReset}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm transition-colors shadow-lg shadow-indigo-600/25"
              >
                <RefreshCw className="w-4 h-4" />
                إعادة المحاولة
              </button>
              <button
                onClick={this.handleGoHome}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-sm transition-colors border border-slate-700"
              >
                <Home className="w-4 h-4" />
                الصفحة الرئيسية
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

