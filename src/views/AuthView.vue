<template>
  <div class="auth-page">
    <h1>Login with Google</h1>
    <button
      type="button"
      class="bg-blue-400 rounded-lg p-3 cursor-pointer"
      @click="handleGoogleLogin"
      :disabled="isLoading"
    >
      <span v-if="isLoading">Loading...</span>
      <span v-else>Sign in with Google</span>
    </button>
    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { storeToRefs } from "pinia";

const router = useRouter();
const authStore = useAuthStore();

const { isLoading, error } = storeToRefs(authStore);

const handleGoogleLogin = async () => {
  const success = await authStore.loginWithGoogle();
  if (success) {
    const redirect = (router.currentRoute.value.query.redirect as string) || "/";
    router.push(redirect);
  }
};
</script>
