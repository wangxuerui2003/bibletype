<template>
  <h1>Welcome {{ user?.name }}</h1>
  <div class="avatar">
    <div class="w-16 rounded">
      <img v-if="avatarUrl" :src="avatarUrl" alt="Profile" class="avatar" />
      <img v-else src="/default.jpg" alt="Default Profile" class="avatar" />
    </div>
  </div>
  <button class="bg-red-500 rounded-lg cursor-pointer p-2" @click="logout">Logout</button>

  <div id="timer">Time: {{ btStore.formattedTime }} | WPM: {{ btStore.wpm }}</div>

  <div id="bible-testament">
    {{ currentProgress.testament == "OT" ? "Old Testament" : "New Testament" }}
  </div>
  <div id="bible-book">{{ currentProgress.book }}</div>
  <div id="bible-chapter">{{ currentProgress.chapter }}</div>
  <div id="bible-verse">{{ currentProgress.verse }}</div>

  <div id="bibletype" ref="btContainerRef">
    <div
      v-for="(word, index) in btStore.words"
      :key="index"
      class="word-container"
      :class="{
        current: index === btStore.currentIndex,
        completed: word.completed,
        incorrect: word.typed.length === word.text.length && word.typed !== word.text,
      }"
    >
      <BTWord :word="word.text" :typed="word.typed" :active="index === btStore.currentIndex" />
    </div>

    <div v-if="btStore.isComplete" class="verse-complete">
      <div class="stats">
        <p>Accuracy: {{ btStore.statistics.accuracy.toFixed(1) }}%</p>
        <p>WPM: {{ btStore.wpm }}</p>
        <p>Time: {{ btStore.formattedTime }}</p>
      </div>
      <button @click="loadNextVerse" class="next-verse-btn">Next Verse</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import BTWord from "@/components/BTWord.vue";
import pocketbase from "@/lib/pocketbase";
import { useAuthStore } from "@/stores/auth";
import { useProgressStore } from "@/stores/progress";
import { useBTStore } from "@/stores/bibletype";
import { storeToRefs } from "pinia";
import { ref, onMounted, onUnmounted, watch } from "vue";
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
const { currentProgress } = storeToRefs(progressStore);

const btStore = useBTStore();
const btContainerRef = ref<HTMLElement | null>(null);

function handleKeyDown(e: KeyboardEvent) {
  if (btStore.isComplete) return;

  const currentWord = btStore.words[btStore.currentIndex];

  if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !btStore.startTime) {
    btStore.startTimer();
  }

  if (e.key === "Backspace") {
    if (currentWord.typed.length === 0) {
      // Check if previous word is incorrect
      const prevWord = btStore.words[btStore.currentIndex - 1];
      if (prevWord && !prevWord.completed) {
        btStore.moveToPreviousWord();
        focusCurrentWord();
        return;
      }
    }
    btStore.updateTypedWord(currentWord.typed.slice(0, -1));
  } else if (e.key === " " && currentWord.typed.length > 0) {
    checkAndMoveToNextWord();
  } else if (e.key.length === 1 && e.key !== " " && !e.ctrlKey && !e.metaKey) {
    btStore.updateTypedWord(currentWord.typed + e.key);
  }
}

// Auto-advance when word is completed
watch(
  () => btStore.words[btStore.currentIndex]?.completed,
  (completed) => {
    if (completed) {
      setTimeout(() => {
        btStore.moveToNextWord();
        focusCurrentWord();
      }, 100); // Small delay for visual feedback
    }
  }
);

function checkAndMoveToNextWord() {
  btStore.moveToNextWord();
  focusCurrentWord();
}

function focusCurrentWord() {
  if (btContainerRef.value) {
    const wordEls = btContainerRef.value.querySelectorAll(".word-container");
    if (wordEls[btStore.currentIndex]) {
      wordEls[btStore.currentIndex].scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }
}

function loadNextVerse() {
  btStore.uploadStatistics();
  progressStore
    .incrementProgress()
    .then(() => progressStore.updateCurrentVerse())
    .then(() => btStore.init(progressStore.getCurrentVerse));
}

onMounted(async () => {
  await progressStore.init();
  await btStore.init(progressStore.getCurrentVerse);
});

onMounted(() => window.addEventListener("keydown", handleKeyDown));
onUnmounted(() => {
  window.removeEventListener("keydown", handleKeyDown);
  btStore.stopTimer();
});
</script>

<style>
.verse-container {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  padding: 1rem;
}

.word-container {
  display: inline-block;
  margin-right: 0.5em;
  position: relative;
}

.word-container.current {
  border-radius: 4px;
}

.word-container.completed {
  opacity: 0.7;
}

.word-container.incorrect {
  color: #ff4444;
}

.verse-complete {
  width: 100%;
  margin-top: 2rem;
  text-align: center;
}

.next-verse-btn {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>
