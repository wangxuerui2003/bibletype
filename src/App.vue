<script setup lang="ts">
import { RouterView } from "vue-router";
import NavBar from "./components/NavBar.vue";
import FooterBar from "./components/FooterBar.vue";
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <NavBar />
    <main class="flex-grow">
      <RouterView />
    </main>
    <FooterBar />
  </div>
</template>

<style></style>
