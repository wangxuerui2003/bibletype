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
    async loginWithGoogle(redirectUrl?: string) {
      this.isLoading = true;
      this.error = null;

      try {
        const authData = await pocketbase.collection("users").authWithOAuth2({
          provider: "google",
          scopes: ["email", "profile"],
          ...(redirectUrl && { callbackUrl: redirectUrl }),
        });

        this.user = pocketbase.authStore.record as User;

        // Check if user was just created
        if (authData.meta?.isNew) {
          await this.initializeNewUser();
        }

        return true;
      } catch (error) {
        this.error = error instanceof Error ? error.message : "Google login failed";
        return false;
      } finally {
        this.isLoading = false;
      }
    },

    async authRefresh() {
      if (pocketbase.authStore?.record) {
        this.user = pocketbase.authStore.record;
      }
    },

    async initializeNewUser() {
      try {
        // Create initial user progress
        await pocketbase.collection("user_progress").create({
          user: this.user?.id,
          testament: "OT",
          book: "Genesis",
          chapter: 1,
          verse: 1,
        });
      } catch (err) {
        console.error("Failed to initialize new user:", err);
      }
    },

    logout() {
      pocketbase.authStore.clear();
      this.user = null;
    },
  },
});
