// ============================================================
// ACCOUNTANCY ASSASSIN — PWA Service Worker & Install Management
// ============================================================

export interface PwaStatus {
  isInstallable: boolean;
  isInstalled: boolean;
  isOfflineReady: boolean;
  hasUpdate: boolean;
}

let deferredPrompt: BeforeInstallPromptEvent | null = null;
const listeners = new Set<(status: PwaStatus) => void>();

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const currentStatus: PwaStatus = {
  isInstallable: false,
  isInstalled: false,
  isOfflineReady: false,
  hasUpdate: false,
};

function notify() {
  listeners.forEach((cb) => cb({ ...currentStatus }));
}

/**
 * Register the Service Worker.
 */
export function registerPwaServiceWorker(basePath: string = '/'): void {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return;
  }

  // Detect standalone mode
  if (
    window.matchMedia('(display-mode: standalone)').matches ||
    (navigator as unknown as { standalone?: boolean }).standalone === true
  ) {
    currentStatus.isInstalled = true;
    notify();
  }

  // Listen for installation prompt
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e as BeforeInstallPromptEvent;
    currentStatus.isInstallable = true;
    notify();
  });

  window.addEventListener('appinstalled', () => {
    deferredPrompt = null;
    currentStatus.isInstallable = false;
    currentStatus.isInstalled = true;
    notify();
  });

  // Construct correct SW URL based on base path
  const normalizedBase = basePath.endsWith('/') ? basePath : `${basePath}/`;
  const swUrl = `${normalizedBase}sw.js`;

  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register(swUrl)
      .then((registration) => {
        // Registration success
        if (registration.active) {
          currentStatus.isOfflineReady = true;
          notify();
        }

        registration.addEventListener('updatefound', () => {
          const installingWorker = registration.installing;
          if (!installingWorker) return;

          installingWorker.addEventListener('statechange', () => {
            if (installingWorker.state === 'installed') {
              if (navigator.serviceWorker.controller) {
                // New update available
                currentStatus.hasUpdate = true;
                notify();
              } else {
                // Content cached for offline use
                currentStatus.isOfflineReady = true;
                notify();
              }
            }
          });
        });
      })
      .catch((err) => {
        console.warn('[PWA] Service worker registration failed:', err);
      });
  });
}

/**
 * Trigger PWA installation prompt if available.
 */
export async function promptPwaInstall(): Promise<boolean> {
  if (!deferredPrompt) return false;
  try {
    await deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    deferredPrompt = null;
    currentStatus.isInstallable = false;
    notify();
    return choice.outcome === 'accepted';
  } catch {
    return false;
  }
}

/**
 * Subscribe to PWA status changes.
 */
export function subscribePwaStatus(callback: (status: PwaStatus) => void): () => void {
  listeners.add(callback);
  callback({ ...currentStatus });
  return () => {
    listeners.delete(callback);
  };
}
