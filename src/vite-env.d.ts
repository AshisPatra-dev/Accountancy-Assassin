/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />

// CSS module declarations
declare module '*.css' {
  const content: Record<string, string>;
  export default content;
}

// PWA virtual module
declare module 'virtual:pwa-register' {
  export type RegisterSWOptions = {
    immediate?: boolean;
    onNeedRefresh?: () => void;
    onOfflineReady?: () => void;
    onRegistered?: (registration: ServiceWorkerRegistration | undefined) => void;
    onRegisterError?: (error: unknown) => void;
  };
  export function registerSW(options?: RegisterSWOptions): (reloadPage?: boolean) => void;
}
