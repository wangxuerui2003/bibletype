<template>
  <div class="min-h-screen flex items-center justify-center p-4 bg-base-100">
    <div class="card w-full max-w-md bg-base-200 shadow-xl">
      <div class="card-body p-8">
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold text-base-content mb-2">Welcome Back</h1>
          <p class="text-base-content/70">Sign in to continue your Bible typing practice</p>
        </div>

        <div class="space-y-4">
          <!-- Google Login Button -->
          <button
            @click="handleGoogleLogin"
            class="btn btn-outline w-full hover:bg-base-300 transition-colors"
            :disabled="isLoading"
          >
            <svg
              v-if="!isLoading"
              class="w-5 h-5 mr-2"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M21.8055 10.0415H21V10H12V14H17.6515C16.827 16.3285 14.6115 18 12 18C8.6865 18 6 15.3135 6 12C6 8.6865 8.6865 6 12 6C13.5295 6 14.921 6.577 15.9805 7.5195L18.809 4.691C17.023 3.0265 14.634 2 12 2C6.4775 2 2 6.4775 2 12C2 17.5225 6.4775 22 12 22C17.5225 22 22 17.5225 22 12C22 11.3295 21.931 10.675 21.8055 10.0415Z"
                fill="#FFC107"
              />
              <path
                d="M3.15332 7.3455L6.43882 9.755C7.32782 7.554 9.48082 6 12 6C13.5295 6 14.921 6.577 15.9805 7.5195L18.809 4.691C17.023 3.0265 14.634 2 12 2C8.15932 2 4.82832 4.1685 3.15332 7.3455Z"
                fill="#FF3D00"
              />
              <path
                d="M12 22C14.583 22 16.93 21.0115 18.7045 19.404L15.6095 16.785C14.6055 17.5455 13.3575 18 12 18C9.399 18 7.1905 16.3415 6.3585 14.027L3.0975 16.5395C4.7525 19.778 8.1135 22 12 22Z"
                fill="#4CAF50"
              />
              <path
                d="M21.8055 10.0415H21V10H12V14H17.6515C17.2575 15.1085 16.5465 16.0765 15.6085 16.7855L15.6095 16.7845L18.7045 19.4035C18.4855 19.6025 22 17 22 12C22 11.3295 21.931 10.675 21.8055 10.0415Z"
                fill="#1976D2"
              />
            </svg>
            <span v-if="isLoading" class="loading loading-spinner loading-sm"></span>
            {{ isLoading ? "Signing in..." : "Continue with Google" }}
          </button>

          <!-- Error Message -->
          <div v-if="error" class="alert alert-error shadow-lg mt-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="stroke-current shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{{ error }}</span>
          </div>
        </div>

        <div class="divider my-6">or</div>

        <p class="text-center text-sm text-base-content/70">
          By continuing, you agree to our
          <a href="#" class="link link-primary">Terms</a> and
          <a href="#" class="link link-primary">Privacy Policy</a>
        </p>
      </div>
    </div>
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

<style scoped>
/* No custom styles needed - using DaisyUI theme variables */
</style>
