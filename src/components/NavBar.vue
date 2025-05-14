<template>
  <div class="navbar bg-base-100 shadow-lg">
    <!-- Nav links -->
    <div class="flex-1">
      <RouterLink
        to="/"
        class="btn btn-ghost text-xl"
        :class="{ 'btn-active': route.path === '/' }"
      >
        Home
      </RouterLink>
      <RouterLink
        to="/faq"
        class="btn btn-ghost text-xl"
        :class="{ 'btn-active': route.path === '/faq' }"
      >
        FAQ
      </RouterLink>
      <RouterLink
        v-if="authStore.isAuthenticated"
        to="/feedback"
        class="btn btn-ghost text-xl"
        :class="{ 'btn-active': route.path === '/feedback' }"
      >
        Feedback
      </RouterLink>
    </div>

    <!-- User Profile -->
    <div class="flex-none gap-2" v-if="authStore.isAuthenticated">
      <div class="dropdown dropdown-end">
        <div
          tabindex="0"
          class="avatar cursor-pointer hover:ring hover:ring-primary hover:ring-offset-2 hover:ring-offset-base-100 transition-all duration-200"
        >
          <div class="w-10 rounded-full">
            <img
              v-if="avatarUrl"
              :src="avatarUrl"
              alt="Profile"
              class="avatar transition-opacity hover:opacity-90"
            />
            <div
              v-else
              class="w-full h-full bg-primary text-primary-content flex items-center justify-center"
            >
              <span class="text-xl font-bold">{{ authStore.user?.name?.charAt(0) || "U" }}</span>
            </div>
          </div>
        </div>

        <!-- Dropdown Menu -->
        <ul
          tabindex="0"
          class="mt-3 z-[1] p-2 shadow-lg menu menu-sm dropdown-content bg-base-100 rounded-box w-56 border border-base-200"
        >
          <li class="menu-title">
            <span class="text-sm font-semibold text-base-content/70">Account</span>
          </li>
          <li>
            <RouterLink
              to="/settings"
              class="justify-between hover:bg-primary/10 hover:text-primary"
              active-class="bg-primary/10 text-primary"
            >
              Settings
              <span class="badge badge-sm badge-ghost">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </span>
            </RouterLink>
          </li>
          <div class="divider my-0"></div>
          <li>
            <a @click="handleLogout" class="hover:bg-error/10 hover:text-error">
              Logout
              <span class="badge badge-sm badge-ghost">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
              </span>
            </a>
          </li>
        </ul>
      </div>
    </div>

    <!-- Unauthenticated -->
    <div class="flex-none" v-else>
      <div class="avatar">
        <div class="w-12 rounded-full">
          <img src="/default.jpg" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterLink, useRoute, useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import pocketbase from "@/lib/pocketbase";
import { computed } from "vue";

const router = useRouter();
const route = useRoute();

const authStore = useAuthStore();
const avatarUrl = computed(() => {
  if (authStore.user?.avatar) {
    return pocketbase.files.getUrl(authStore.user, authStore.user.avatar, {
      thumb: "100x250",
    });
  }
  return null;
});

const handleLogout = () => {
  authStore.logout();
  router.push("/auth");
};
</script>

<style scoped>
.navbar {
  position: sticky;
  top: 0;
  z-index: 50;
  padding: 0 2rem;
}

.avatar img {
  transition: transform 0.2s;
}

.avatar:hover img {
  transform: scale(1.1);
}
</style>
