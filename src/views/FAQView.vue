<template>
  <div class="min-h-screen bg-base-100 p-6">
    <div class="max-w-3xl mx-auto">
      <h1 class="text-4xl font-bold text-center mb-8 text-primary">Frequently Asked Questions</h1>

      <div class="space-y-4">
        <div
          v-for="(faq, index) in faqs"
          :key="index"
          class="collapse collapse-plus bg-base-200 rounded-box"
          :class="{ 'border border-primary': activeIndex === index }"
        >
          <input
            type="radio"
            name="faq-accordion"
            :checked="activeIndex === index"
            @click="toggleAccordion(index)"
          />
          <div class="collapse-title text-xl font-medium">
            {{ faq.question }}
          </div>
          <div class="collapse-content">
            <p class="pt-2">{{ faq.answer }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const activeIndex = ref(null);

const toggleAccordion = (index) => {
  activeIndex.value = activeIndex.value === index ? null : index;
};

const faqs = ref([
  {
    question: "What is BibleType?",
    answer:
      "BibleType is a typing practice application that helps you improve your typing speed and accuracy while engaging with the Holy Bible. You type verses from the Bible and get real-time feedback on your performance.",
  },
  {
    question: "How is typing speed calculated?",
    answer:
      "Your words per minute (WPM) is calculated based on the number of characters you type correctly divided by 5 (standard word length) and adjusted for the time taken. Only correctly typed characters count towards your score.",
  },
  {
    question: "Can I choose specific Bible books or chapters?",
    answer:
      "Currently, BibleType progresses sequentially through Hody Bible, but we're working on adding book/chapter selection in a future update.",
  },
  {
    question: "Why does it mark words as incorrect when I'm still typing them?",
    answer:
      "Words are only marked incorrect when you complete them (usually by pressing space) and they don't match the target text. While typing, incorrect characters will be highlighted but the word won't be marked incorrect until you finish it.",
  },
  {
    question: "How do I move to the next verse?",
    answer:
      "After completing a verse, a 'Next Verse' button will appear. Click it to proceed to the next Hody Bible passage.",
  },
  {
    question: "Is my progress saved if I leave the page?",
    answer:
      "Yes! Your progress through the Bible is automatically saved to the backend. When you return, you'll pick up where you left off.",
  },
  {
    question: "Can I practice the same verse multiple times?",
    answer:
      "Currently the system progresses sequentially, but you can manually navigate back to previous verses in your reading history if you want to practice them again.",
  },
  {
    question: "What Bible translation is being used?",
    answer:
      "BibleType currently uses the New International Version (NIV), known for its balance of accuracy and readability. We may add more translation options in the future.",
  },
  {
    question: "Who is the person in the default avatar?",
    answer: "President Donald Chang, the idea provider of this project. You're welcome.",
  },
]);
</script>

<style scoped>
.collapse-title {
  padding-left: 2rem;
}
.collapse-content {
  padding-left: 2rem;
  padding-right: 1rem;
}
</style>
