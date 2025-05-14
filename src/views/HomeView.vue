<template>
  <div class="min-h-screen bg-base-200 p-6">
    <!-- Timer -->
    <div class="stats shadow mb-6 bg-base-100">
      <div class="stat">
        <div class="stat-title">Time</div>
        <div class="stat-value text-primary">{{ btStore.formattedTime }}</div>
        <div class="stat-desc">WPM: {{ btStore.wpm }}</div>
      </div>
    </div>

    <!-- Bible Reference -->
    <div class="flex flex-wrap gap-2 mb-8 justify-center">
      <div class="badge badge-lg badge-primary">
        {{ currentProgress.testament === "OT" ? "Old Testament" : "New Testament" }}
      </div>
      <div class="badge badge-lg badge-secondary">{{ currentProgress.book }}</div>
      <div class="badge badge-lg badge-accent">Chapter {{ currentProgress.chapter }}</div>
      <div class="badge badge-lg badge-info">Verse {{ currentProgress.verse }}</div>
    </div>

    <!-- Typing Area -->
    <div class="card bg-base-100 shadow-xl p-6 mb-8">
      <div id="bibletype" ref="btContainerRef" class="text-3xl leading-relaxed text-center">
        <div
          v-for="(word, index) in btStore.words"
          :key="index"
          class="inline-block mx-1 px-2 rounded transition-all duration-200"
          :class="{
            'bg-success/20': word.completed,
            'bg-error/20': word.typed.length === word.text.length && word.typed !== word.text,
            'ring-2 ring-primary': index === btStore.currentIndex,
          }"
        >
          <BTWord
            :word="word.text"
            :typed="word.typed"
            :active="index === btStore.currentIndex"
            class="text-4xl"
          />
        </div>
      </div>
    </div>

    <!-- Results Card -->
    <div
      v-if="btStore.isComplete"
      class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
    >
      <div class="card bg-base-100 shadow-xl w-full max-w-sm mx-4">
        <div class="card-body p-4 text-center">
          <h2 class="card-title justify-center text-xl mb-2">Verse Complete! 🎉</h2>

          <div class="text-sm text-gray-500 mb-4">
            Press <kbd class="kbd kbd-sm">Enter</kbd> for next verse or
            <kbd class="kbd kbd-sm">Esc</kbd> to redo
          </div>

          <div class="grid grid-cols-3 gap-2 mb-4">
            <div class="bg-base-200 p-2 rounded-lg">
              <div class="text-sm opacity-70">Accuracy</div>
              <div class="text-lg font-bold text-secondary">
                {{ btStore.statistics.accuracy.toFixed(1) }}%
              </div>
            </div>

            <div class="bg-base-200 p-2 rounded-lg">
              <div class="text-sm opacity-70">Time</div>
              <div class="text-lg font-bold text-primary">{{ btStore.formattedTime }}</div>
            </div>

            <div class="bg-base-200 p-2 rounded-lg">
              <div class="text-sm opacity-70">WPM</div>
              <div class="text-lg font-bold text-accent">{{ btStore.wpm }}</div>
            </div>
          </div>

          <div class="flex justify-center gap-4">
            <button @click="redoCurrentVerse" class="btn btn-outline btn-sm px-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Redo
            </button>
            <button @click="loadNextVerse" class="btn btn-success btn-sm px-4">
              Next Verse
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4 ml-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 5l7 7-7 7M5 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import BTWord from "@/components/BTWord.vue";
import { useProgressStore } from "@/stores/progress";
import { useBTStore } from "@/stores/bibletype";
import { storeToRefs } from "pinia";
import { ref, onMounted, onUnmounted, watch } from "vue";

const progressStore = useProgressStore();
const { currentProgress } = storeToRefs(progressStore);

const btStore = useBTStore();
const btContainerRef = ref<HTMLElement | null>(null);

function handleKeyDown(e: KeyboardEvent) {
  if (btStore.isComplete) {
    // Let the modal handle these keys
    if (e.key === "Enter") {
      e.preventDefault();
      loadNextVerse();
    } else if (e.key === "Escape") {
      e.preventDefault();
      redoCurrentVerse();
    }
    return;
  }

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

const redoCurrentVerse = async () => {
  btStore.stopTimer();
  await btStore.init(progressStore.getCurrentVerse);
};

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
/* Custom transitions */
#bibletype {
  font-family: "Courier New", monospace;
}

.word-container {
  transition: all 0.2s ease;
}

/* Scroll behavior */
html {
  scroll-behavior: smooth;
}

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

.flex.justify-center.gap-4 {
  gap: 1rem;
}

.btn-outline {
  border-color: hsl(var(--p));
  color: hsl(var(--p));
}

.btn-outline:hover {
  background-color: hsl(var(--p) / 0.1);
}
</style>
