<!-- views/FeedbackView.vue -->
<template>
  <div class="min-h-screen bg-base-100 p-6">
    <div class="max-w-7xl mx-auto">
      <h1 class="text-3xl font-bold mb-8">Feedback Center</h1>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Feedback Column -->
        <div class="card bg-base-200 shadow">
          <div class="card-body">
            <div class="flex justify-between items-center mb-4">
              <h2 class="card-title">Feedback</h2>
              <button @click="openModal('feedback')" class="btn btn-sm btn-primary">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Add
              </button>
            </div>
            <div class="space-y-4">
              <div
                v-for="(item, index) in feedbackItems"
                :key="'feedback-' + index"
                class="card bg-base-100 shadow-sm p-4"
              >
                <p>{{ item.content }}</p>
                <div class="text-xs opacity-50 mt-2">{{ formatDate(item.created) }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Bugs Column -->
        <div class="card bg-base-200 shadow">
          <div class="card-body">
            <div class="flex justify-between items-center mb-4">
              <h2 class="card-title">Bug Reports</h2>
              <button @click="openModal('bug')" class="btn btn-sm btn-error">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Report
              </button>
            </div>
            <div class="space-y-4">
              <div
                v-for="(item, index) in bugItems"
                :key="'bug-' + index"
                class="card bg-base-100 shadow-sm p-4"
              >
                <p>{{ item.content }}</p>
                <div class="text-xs opacity-50 mt-2">{{ formatDate(item.created) }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Suggestions Column -->
        <div class="card bg-base-200 shadow">
          <div class="card-body">
            <div class="flex justify-between items-center mb-4">
              <h2 class="card-title">Suggestions</h2>
              <button @click="openModal('suggestion')" class="btn btn-sm btn-success">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Suggest
              </button>
            </div>
            <div class="space-y-4">
              <div
                v-for="(item, index) in suggestionItems"
                :key="'suggestion-' + index"
                class="card bg-base-100 shadow-sm p-4"
              >
                <p>{{ item.content }}</p>
                <div class="text-xs opacity-50 mt-2">{{ formatDate(item.created) }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal for adding new items -->
    <div class="modal" :class="{ 'modal-open': showModal }">
      <div class="modal-box">
        <h3 class="font-bold text-lg mb-4">Add New {{ modalTitle }}</h3>
        <textarea
          v-model="newItemContent"
          class="textarea textarea-bordered w-full h-32"
          :placeholder="'Enter your ' + activeType"
        ></textarea>
        <div class="modal-action">
          <button @click="closeModal" class="btn btn-ghost">Cancel</button>
          <button @click="submitItem" class="btn btn-primary">Submit</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import pocketbase from "@/lib/pocketbase";

const router = useRouter();

// Sample data - replace with PocketBase integration later
const feedbackItems = ref([
  { content: "Love the typing experience!", created: new Date() },
  { content: "The verse selection is great", created: new Date(Date.now() - 86400000) },
]);

const bugItems = ref([
  { content: "Timer sometimes doesn't start", created: new Date(Date.now() - 172800000) },
]);

const suggestionItems = ref([
  { content: "Add more Bible translations", created: new Date(Date.now() - 259200000) },
  { content: "Dark mode toggle would be nice", created: new Date(Date.now() - 345600000) },
]);

// Modal state
const showModal = ref(false);
const activeType = ref<"feedback" | "bug" | "suggestion">("feedback");
const newItemContent = ref("");

const modalTitle = computed(() => {
  switch (activeType.value) {
    case "feedback":
      return "Feedback";
    case "bug":
      return "Bug Report";
    case "suggestion":
      return "Suggestion";
    default:
      return "";
  }
});

const openModal = (type: "feedback" | "bug" | "suggestion") => {
  activeType.value = type;
  newItemContent.value = "";
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
};

const submitItem = () => {
  if (!newItemContent.value.trim()) return;

  const newItem = {
    content: newItemContent.value,
    created: new Date(),
  };

  switch (activeType.value) {
    case "feedback":
      feedbackItems.value.unshift(newItem);
      break;
    case "bug":
      bugItems.value.unshift(newItem);
      break;
    case "suggestion":
      suggestionItems.value.unshift(newItem);
      break;
  }

  // TODO: Add PocketBase upload logic here
  closeModal();
};

const formatDate = (date: Date) => {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

// Check authentication
if (!pocketbase.authStore.isValid) {
  router.push("/auth");
}
</script>

<style scoped>
.card-title {
  margin-bottom: 0;
}
</style>
