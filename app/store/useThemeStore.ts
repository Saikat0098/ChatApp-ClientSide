import { create } from "zustand";

type ThemeStore = {
  theme: string;
  setTheme: (theme: string) => void;
};

export const useThemeStore = create<ThemeStore>((set) => {
  // Check if window is defined (i.e., running in browser)
  const isBrowser = typeof window !== "undefined";

  const savedTheme = isBrowser
    ? localStorage.getItem("chat-theme") || "retro"
    : "retro"; // fallback default

  return {
    theme: savedTheme,
    setTheme: (theme: string) => {
      if (isBrowser) {
        localStorage.setItem("chat-theme", theme);
      }
      set({ theme });
    },
  };
});
