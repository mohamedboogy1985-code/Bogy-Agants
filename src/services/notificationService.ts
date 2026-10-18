// Browser Desktop Notification Service for Multi-Agent Swarm

export interface InAppToast {
  id: string;
  agentId: string;
  agentName: string;
  title: string;
  body: string;
  timestamp: string;
}

class NotificationService {
  private permission: NotificationPermission = 'default';
  private listeners: ((toast: InAppToast) => void)[] = [];

  constructor() {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      this.permission = Notification.permission;
    }
  }

  public isSupported(): boolean {
    return typeof window !== 'undefined' && 'Notification' in window;
  }

  public getPermission(): NotificationPermission {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      this.permission = Notification.permission;
      return this.permission;
    }
    return 'denied';
  }

  public async requestPermission(): Promise<NotificationPermission> {
    if (!this.isSupported()) {
      return 'denied';
    }

    try {
      const result = await Notification.requestPermission();
      this.permission = result;
      return result;
    } catch (err) {
      console.warn('Notification permission request error:', err);
      return 'denied';
    }
  }

  // Subscribe to in-app toast alerts
  public onToast(callback: (toast: InAppToast) => void) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== callback);
    };
  }

  // Send desktop notification when an agent completes a task
  public notifyTaskCompletion(
    agentName: string,
    title: string,
    body: string,
    agentId: string = 'master'
  ) {
    const toastItem: InAppToast = {
      id: 'toast-' + Date.now(),
      agentId,
      agentName,
      title,
      body,
      timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
    };

    // 1. Notify in-app subscribers (floating toast)
    this.listeners.forEach((listener) => listener(toastItem));

    // 2. Trigger native OS Desktop Notification
    if (this.isSupported() && Notification.permission === 'granted') {
      try {
        const notification = new Notification(`Bogy Agents AI: ${agentName}`, {
          body: `${title}\n${body}`,
          icon: '/favicon.ico',
          tag: `bogy-${agentId}-${Date.now()}`,
          requireInteraction: false,
          silent: false,
        });

        notification.onclick = () => {
          window.focus();
          notification.close();
        };

        // Auto close after 6 seconds
        setTimeout(() => {
          try {
            notification.close();
          } catch {}
        }, 6000);
      } catch (err) {
        console.warn('Failed to dispatch native desktop notification:', err);
      }
    }
  }

  // Send a quick test notification
  public sendTestNotification() {
    this.notifyTaskCompletion(
      'الوكيل العام (Bogy Prime)',
      'مرحباً بكم ببرنامج وكلاء بوجي 🔔',
      'تهانينا! نظام إشعارات سطح المكتب يعمل بنجاح. ستصلك التنبيهات فور إنجاز الوكلاء لمهامهم حتى والنافذة في الخلفية.',
      'master'
    );
  }
}

export const notificationService = new NotificationService();
