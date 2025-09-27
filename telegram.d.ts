// This file provides TypeScript definitions for the Telegram Web App API.
// It allows us to use `window.Telegram.WebApp` without type errors.

declare global {
  interface Window {
    Telegram?: {
      WebApp: {
        initDataUnsafe: {
          user?: {
            id: number;
            first_name: string;
            last_name?: string;
            username?: string;
            photo_url?: string;
          };
        };
        ready: () => void;
        // You can add other Telegram Web App methods here if needed
      };
    };
  }
}

// This export statement is required to make this file a module
// and have the global declaration work correctly.
export {};
