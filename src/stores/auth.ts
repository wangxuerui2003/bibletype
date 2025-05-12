import { defineStore } from "pinia";
import pocketbase from "@/lib/pocketbase";
import type { User } from "@/lib/pocketbase";

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

export const useAuthStore = defineStore("auth", {
  state: (): AuthState => ({
    user: pocketbase.authStore.record as User | null,
    isLoading: false,
    error: null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.user,
    currentUser: (state) => state.user,
  },

  actions: {
    async init() {
      try {
        // Refresh auth state if token exists
        if (pocketbase.authStore.isValid) {
          await pocketbase.collection("users").authRefresh();
          this.user = pocketbase.authStore.record as User;
        }
      } catch (err) {
        this.logout();
      }
    },

    async loginWithGoogle(redirectUrl?: string) {
      this.isLoading = true;
      this.error = null;

      try {
        await pocketbase.collection("users").authWithOAuth2({
          provider: "google",
          scopes: ["email", "profile"],
          ...(redirectUrl && { callbackUrl: redirectUrl }),
        });

        this.user = pocketbase.authStore.record as User;
        window.pocketbase = pocketbase;
        return true;
      } catch (error) {
        this.error = error instanceof Error ? error.message : "Google login failed";
        return false;
      } finally {
        this.isLoading = false;
      }
    },

    logout() {
      pocketbase.authStore.clear();
      this.user = null;
    },
  },
});
