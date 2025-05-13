<template>
  <div class="bt-word" :class="{ active }">
    <!-- Initial cursor for empty word -->

    <span
      v-for="(char, index) in word.split('')"
      :key="index"
      class="char-container"
      :class="{
        correct: typed && index < typed.length && char === typed[index],
        incorrect: typed && index < typed.length && char !== typed[index],
        pending: typed && index >= typed.length,
        untyped: !typed,
      }"
    >
      <span
        v-if="active && typed.length === 0 && index === 0"
        class="blinking-cursor initial-cursor"
      ></span>
      {{ char }}
      <span v-if="active && index === typed.length - 1" class="blinking-cursor"></span>
    </span>
    <!-- Show overflow characters -->
    <span
      v-for="(_, index) in Math.max(0, typed.length - word.length)"
      :key="'extra-' + index"
      class="char-container incorrect extra-char"
    >
      {{ typed[word.length + index] }}
    </span>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  word: string;
  typed: string;
  active?: boolean;
}>();
</script>

<style scoped>
.bt-word {
  font-size: 1.2rem;
  line-height: 1.5;
}

.bt-word.active {
  text-decoration: underline;
}

.correct {
  color: #4caf50;
}

.incorrect {
  color: #ff5722;
  text-decoration: underline;
}

.pending {
  opacity: 0.5;
}

.extra-char {
  text-decoration: underline;
  color: #ff0000;
}

.extra-error {
  position: relative;
}

.extra-error::after {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  bottom: -2px;
  height: 2px;
  background: #ff0000;
}

.initial-cursor {
  left: -2px;
  right: auto;
  display: inline-block;
}

.char-container {
  position: relative;
  display: inline-block;
}

.blinking-cursor {
  position: absolute;
  right: -2px;
  top: 45%;
  transform: translateY(-45%);
  width: 2px;
  height: 1.2em;
  background: #4caf50;
  animation: blink 1s infinite;
}

@keyframes blink {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

.current-char {
  position: relative;
  transition: transform 0.1s ease;
}

.current-char::after {
  content: "";
  position: absolute;
  right: -2px;
  top: 50%;
  transform: translateY(-45%);
  width: 2px;
  height: 1.2em;
  background: #4caf50;
  animation: blink 1s infinite;
}
</style>
