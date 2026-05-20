import React, { useState, useEffect } from 'react';
import { X, Key, CheckCircle, AlertTriangle, HelpCircle } from 'lucide-react';
import { getApiKeyConfig, setApiKeyConfig, isUsingMockData } from '../services/tmdb';

export default function ApiSettings({ isOpen, onClose, onKeyChange }) {
  const [apiKey, setApiKey] = useState('');
  const [status, setStatus] = useState({ type: 'info', message: '' });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setApiKey(getApiKeyConfig());
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus({ type: 'info', message: 'Đang kiểm tra API key...' });

    if (!apiKey.trim()) {
      setApiKeyConfig('');
      setStatus({ type: 'success', message: 'Đã xóa API key. Hệ thống sẽ sử dụng dữ liệu Mock.' });
      setIsLoading(false);
      onKeyChange();
      setTimeout(() => {
        onClose();
      }, 1000);
      return;
    }

    try {
      // Test key by requesting a simple endpoint
      const response = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${apiKey.trim()}&language=vi-VN`);
      if (response.ok) {
        setApiKeyConfig(apiKey.trim());
        setStatus({ type: 'success', message: 'Kết nối thành công! Đã lưu API key.' });
        onKeyChange();
        setTimeout(() => {
          onClose();
        }, 1200);
      } else {
        setStatus({ type: 'error', message: 'API Key không hợp lệ. Vui lòng kiểm tra lại.' });
      }
    } catch (err) {
      setStatus({ type: 'error', message: 'Không thể kết nối tới TMDB API. Vui lòng kiểm tra mạng.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-md overflow-hidden bg-white/90 dark:bg-slate-900/95 border border-white/20 rounded-2xl shadow-2xl transition-all-300">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Key className="w-5 h-5 text-brand-yellow-dark" />
            <h3 className="text-lg font-bold text-slate-800 dark:text-white">TMDB API Settings</h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSave} className="p-5 space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              TMDB API Key (v3)
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Nhập API Key của bạn..."
              className="w-full px-4 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-brand-yellow focus:border-brand-yellow outline-none text-slate-800 dark:text-white"
            />
          </div>

          {/* Guide */}
          <div className="p-3 text-xs text-slate-600 dark:text-slate-400 bg-brand-blue-light/30 border border-brand-blue/30 rounded-xl flex gap-2">
            <HelpCircle className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
            <div>
              Bạn cần có tài khoản tại <a href="https://www.themoviedb.org/" target="_blank" rel="noreferrer" className="underline font-semibold hover:text-blue-600">themoviedb.org</a>. Đăng nhập, vào Settings &gt; API để lấy API Key miễn phí. Nếu để trống, ứng dụng sẽ chạy ở chế độ <b>Mock Data (Demo)</b>.
            </div>
          </div>

          {/* Status Message */}
          {status.message && (
            <div className={`p-3 rounded-xl text-sm flex gap-2 items-center ${
              status.type === 'success' ? 'bg-green-100 text-green-800 border border-green-200' :
              status.type === 'error' ? 'bg-red-100 text-red-800 border border-red-200' :
              'bg-blue-100 text-blue-800 border border-blue-200'
            }`}>
              {status.type === 'success' && <CheckCircle className="w-4 h-4 text-green-600 shrink-0" />}
              {status.type === 'error' && <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />}
              <span className="font-medium">{status.message}</span>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 justify-end pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium border border-slate-300 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-all-300"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium bg-brand-yellow hover:bg-brand-yellow-dark text-slate-900 rounded-xl font-bold shadow-md hover:shadow-lg disabled:opacity-50 transition-all-300 flex items-center justify-center min-w-[80px]"
            >
              {isLoading ? 'Đang lưu...' : 'Lưu lại'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
