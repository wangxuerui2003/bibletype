<template>
  <h1>Welcome {{ user?.name }}</h1>
  <div class="avatar">
    <div class="w-16 rounded">
      <img v-if="avatarUrl" :src="avatarUrl" alt="Profile" class="avatar" />
    </div>
  </div>
  <button class="bg-red-500 rounded-lg cursor-pointer p-2" @click="logout">Logout</button>

  <div id="timer"></div>

  <div id="bible-testament">
    {{ currentProgress.testament == "OT" ? "Old Testament" : "New Testament" }}
  </div>
  <div id="bible-book">{{ currentProgress.book }}</div>
  <div id="bible-chapter">{{ currentProgress.chapter }}</div>
  <div id="bible-verse">{{ currentProgress.verse }}</div>

  <!-- <div id="bibletype" v-for="(word, index) in verse" :key="index">
    <BTWord :word="word"></BTWord>
  </div> -->
</template>

<script setup lang="ts">
import BTWord from "@/components/BTWord.vue";
import pocketbase from "@/lib/pocketbase";
import { useAuthStore } from "@/stores/auth";
import { useProgressStore } from "@/stores/progress";
import { storeToRefs } from "pinia";
import { onBeforeMount } from "vue";
import { ref } from "vue";
import { onMounted } from "vue";
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

const progressStore = useProgressStore();
console.log("sdlfkdsfjslfkjdslkfdsjkl");
const { currentProgress } = storeToRefs(progressStore);
const { incrementProgress } = progressStore;

const verse = ref(progressStore.getCurrentVerse.split(/\s+/));

onMounted(async () => {
  // TODO: add keyboard event listener. when start typing start the timer
  // TODO: keep track of the BTWord components of where user is at
  // TODO: when finished typing show statistics, incrementProgress and upload statistics
  // TODO: show "next verse" button
  await progressStore.init();

  await incrementProgress();
});
</script>
