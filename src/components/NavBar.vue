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
        <div tabindex="0" class="avatar cursor-pointer">
          <div class="w-12 rounded-full">
            <img v-if="avatarUrl" :src="avatarUrl" alt="Profile" class="avatar" />
            <img v-else src="/default.jpg" />
          </div>
        </div>

        <!-- Dropdown Menu -->
        <ul
          tabindex="0"
          class="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52"
        >
          <li>
            <RouterLink to="/settings" class="justify-between">
              Settings
              <span class="badge">New</span>
            </RouterLink>
          </li>
          <li><a @click="handleLogout">Logout</a></li>
        </ul>
      </div>
    </div>

    <!-- 未登录状态 -->
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
