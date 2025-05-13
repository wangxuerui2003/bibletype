<template>
  <div class="word" v-for="(letter, index) in word" :key="index">
    <BTLetter :letter="letter"></BTLetter>
  </div>
</template>

<script setup lang="ts">
import BTLetter from "./BTLetter.vue";

defineProps<{
  word: string;
}>();
</script>
