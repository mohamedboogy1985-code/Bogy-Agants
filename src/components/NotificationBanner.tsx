import React, { useState, useEffect } from 'react';
import { Bell, BellRing, BellOff, CheckCircle2, X, Sparkles, Terminal, FileSpreadsheet, Globe, Bot } from 'lucide-react';
import { notificationService, InAppToast } from '../services/notificationService';

export const NotificationBanner: React.FC = () => {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [toasts, setToasts] = useState<InAppToast[]>([]);
  const [showDismissedBanner, setShowDismissedBanner] = useState(false);

  useEffect(() => {
    setPermission(notificationService.getPermission());

    const unsubscribe = notificationService.onToast((newToast) => {
      setToasts((prev) => [newToast, ...prev.slice(0, 3)]); // Keep up to 4 toasts
      // Auto dismiss after 5.5s
      setTimeout(() => {
        setToasts((current) => current.filter((t) => t.id !== newToast.id));
      }, 5500);
    });

    return () => unsubscribe();
  }, []);

  const handleRequestPermission = async () => {
    const res = await notificationService.requestPermission();
    setPermission(res);
    if (res === 'granted') {
      notificationService.sendTestNotification();
    }
  };

  const handleTestNotification = () => {
    notificationService.sendTestNotification();
  };

  const handleDismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const getAgentIcon = (agentId: string) => {
    switch (agentId) {
      case 'windows':
        return <Terminal className="w-4 h-4 text-blue-400" />;
      case 'office':
        return <FileSpreadsheet className="w-4 h-4 text-emerald-400" />;
      case 'web':
        return <Globe className="w-4 h-4 text-violet-400" />;
      default:
        return <Bot className="w-4 h-4 text-cyan-400" />;
    }
  };

  return (
    <>
      {/* 1. Desktop Notification Permission Prompt / Status Bar */}
      {!showDismissedBanner && (
        <div className="rounded-xl bg-gradient-to-r from-blue-950/40 via-slate-900/90 to-cyan-950/40 border border-cyan-800/50 p-3 sm:p-3.5 shadow-lg backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div
              className={`p-2 rounded-lg flex items-center justify-center ${
                permission === 'granted'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : permission === 'denied'
                  ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                  : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 animate-pulse'
              }`}
            >
              {permission === 'granted' ? (
                <BellRing className="w-4 h-4 text-emerald-400" />
              ) : permission === 'denied' ? (
                <BellOff className="w-4 h-4 text-red-400" />
              ) : (
                <Bell className="w-4 h-4 text-cyan-400" />
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-100">
                  {permission === 'granted'
                    ? 'إشعارات سطح المكتب مفعّلة بنجاح 🔔'
                    : permission === 'denied'
                    ? 'إشعارات المتصفح محظورة حالياً'
                    : 'تنبيهات سطح المكتب الفورية (Browser Notifications)'}
                </span>
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                    permission === 'granted'
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {permission === 'granted' ? 'نشط تلقائياً' : 'ميزة جديدة'}
                </span>
              </div>
              <p className="text-slate-400 text-[11px] mt-0.5">
                {permission === 'granted'
                  ? 'ستصلك رسائل تنبيه على شاشة ويندوز فور انتهاء أي وكيل من مهامه حتى عند تصغير المتصفح.'
                  : permission === 'denied'
                  ? 'يمكنك تفعيل الإشعارات من إعدادات المتصفح بجوار شريط العنوان لاستلام التنبيهات في الخلفية.'
                  : 'اضغط لتفعيل الإشعارات لتتمكن من متابعة إنجازات الوكلاء دون الحاجة لإبقاء النافذة مفتوحة دائماً.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center">
            {permission === 'default' && (
              <button
                onClick={handleRequestPermission}
                className="px-3.5 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold transition-all shadow-md shadow-cyan-600/30 cursor-pointer flex items-center gap-1.5 whitespace-nowrap"
              >
                <Bell className="w-3.5 h-3.5" />
                <span>تفعيل التنبيهات</span>
              </button>
            )}

            {permission === 'granted' && (
              <button
                onClick={handleTestNotification}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap"
                title="إرسال تنبيه تجريبي لسطح المكتب الآن"
              >
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>إرسال إشعار تجريبي</span>
              </button>
            )}

            <button
              onClick={() => setShowDismissedBanner(true)}
              className="p-1 rounded text-slate-500 hover:text-slate-300 transition-colors"
              title="إخفاء هذا الشريط"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* 2. Floating In-App Live Notification Toasts (Top-Left or Top-Right) */}
      {toasts.length > 0 && (
        <div className="fixed bottom-6 left-6 z-50 space-y-2.5 max-w-sm w-full pointer-events-none">
          {toasts.map((t) => (
            <div
              key={t.id}
              className="pointer-events-auto p-3.5 rounded-xl bg-slate-950/95 border border-cyan-500/50 shadow-2xl backdrop-blur-xl text-xs space-y-1.5 animate-slide-up"
            >
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-1.5">
                <div className="flex items-center gap-2">
                  <div className="p-1 rounded bg-slate-900 border border-slate-800">
                    {getAgentIcon(t.agentId)}
                  </div>
                  <span className="font-bold text-slate-200">{t.agentName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-slate-500">{t.timestamp}</span>
                  <button
                    onClick={() => handleDismissToast(t.id)}
                    className="text-slate-500 hover:text-slate-300 cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              </div>

              <div>
                <h5 className="font-semibold text-cyan-300 text-xs flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  {t.title}
                </h5>
                <p className="text-[11px] text-slate-400 leading-relaxed mt-0.5 line-clamp-2">
                  {t.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};
