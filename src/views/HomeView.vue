<template>
  <div>
    <h1>Welcome {{ user?.name }}</h1>
    <img v-if="avatarUrl" :src="avatarUrl" alt="Profile" class="avatar" />
    <button class="bg-red-500 rounded-lg cursor-pointer p-2" @click="logout">Logout</button>
  </div>
</template>

<script setup lang="ts">
import pocketbase from "@/lib/pocketbase";
import { useAuthStore } from "@/stores/auth";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";

const router = useRouter();

const authStore = useAuthStore();
const { user } = storeToRefs(authStore);
const avatarUrl = pocketbase.files.getURL(pocketbase.authStore.record, user.value.avatar, {
  thumb: "100x250",
});
const logout = () => {
  authStore.logout();
  router.push("/auth");
};
</script>
