import React, { Component } from 'react';
import { AlertTriangle } from 'lucide-react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 bg-red-50 border-2 border-red-100 rounded-3xl text-center space-y-4">
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
            <AlertTriangle size={32} />
          </div>
          <h2 className="text-xl font-bold text-red-600">エラーが発生しました</h2>
          <p className="text-sm text-red-500">
            申し訳ありません。予期せぬエラーが発生しました。<br />
            {this.state.error?.message.includes('too large') ? 'データ量が多すぎてQRコードを作成できません。' : 'アプリを再読み込みしてください。'}
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-red-600 text-white rounded-xl font-bold"
          >
            再読み込み
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
