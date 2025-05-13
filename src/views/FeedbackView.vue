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

            <div v-if="isLoading[CATEGORY.FEEDBACK]" class="flex justify-center py-4">
              <span class="loading loading-spinner loading-lg"></span>
            </div>

            <div v-else class="space-y-4">
              <div
                v-for="(item, index) in feedbackItems"
                :key="item.id"
                class="card bg-base-100 shadow-sm p-4"
              >
                <p>{{ item.content }}</p>
                <div class="flex justify-between items-center mt-2">
                  <div class="text-xs opacity-50">
                    {{ getUsername(item) }} • {{ formatDate(item.created) }}
                  </div>
                </div>
              </div>

              <div class="flex justify-between mt-4">
                <button
                  @click="changePage(CATEGORY.FEEDBACK, 'prev')"
                  class="btn btn-sm"
                  :disabled="currentPage[CATEGORY.FEEDBACK] <= 1"
                >
                  Previous
                </button>
                <span class="text-sm self-center">
                  Page {{ currentPage[CATEGORY.FEEDBACK] }} of
                  {{ Math.ceil(totalItems[CATEGORY.FEEDBACK] / perPage) }}
                </span>
                <button
                  @click="changePage(CATEGORY.FEEDBACK, 'next')"
                  class="btn btn-sm"
                  :disabled="
                    currentPage[CATEGORY.FEEDBACK] >=
                    Math.ceil(totalItems[CATEGORY.FEEDBACK] / perPage)
                  "
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Bug Column -->
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

            <div v-if="isLoading[CATEGORY.BUG]" class="flex justify-center py-4">
              <span class="loading loading-spinner loading-lg"></span>
            </div>

            <div v-else class="space-y-4">
              <div
                v-for="(item, index) in bugItems"
                :key="item.id"
                class="card bg-base-100 shadow-sm p-4"
              >
                <p>{{ item.content }}</p>
                <div class="flex justify-between items-center mt-2">
                  <div class="text-xs opacity-50">
                    {{ getUsername(item) }} • {{ formatDate(item.created) }}
                  </div>
                </div>
              </div>

              <div class="flex justify-between mt-4">
                <button
                  @click="changePage(CATEGORY.BUG, 'prev')"
                  class="btn btn-sm"
                  :disabled="currentPage[CATEGORY.BUG] <= 1"
                >
                  Previous
                </button>
                <span class="text-sm self-center">
                  Page {{ currentPage[CATEGORY.BUG] }} of
                  {{ Math.ceil(totalItems[CATEGORY.BUG] / perPage) }}
                </span>
                <button
                  @click="changePage(CATEGORY.BUG, 'next')"
                  class="btn btn-sm"
                  :disabled="
                    currentPage[CATEGORY.BUG] >= Math.ceil(totalItems[CATEGORY.BUG] / perPage)
                  "
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Suggestion Column -->
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

            <div v-if="isLoading[CATEGORY.SUGGESTION]" class="flex justify-center py-4">
              <span class="loading loading-spinner loading-lg"></span>
            </div>

            <div v-else class="space-y-4">
              <div
                v-for="(item, index) in suggestionItems"
                :key="item.id"
                class="card bg-base-100 shadow-sm p-4"
              >
                <p>{{ item.content }}</p>
                <div class="flex justify-between items-center mt-2">
                  <div class="text-xs opacity-50">
                    {{ getUsername(item) }} • {{ formatDate(item.created) }}
                  </div>
                </div>
              </div>

              <div class="flex justify-between mt-4">
                <button
                  @click="changePage(CATEGORY.SUGGESTION, 'prev')"
                  class="btn btn-sm"
                  :disabled="currentPage[CATEGORY.SUGGESTION] <= 1"
                >
                  Previous
                </button>
                <span class="text-sm self-center">
                  Page {{ currentPage[CATEGORY.SUGGESTION] }} of
                  {{ Math.ceil(totalItems[CATEGORY.SUGGESTION] / perPage) }}
                </span>
                <button
                  @click="changePage(CATEGORY.SUGGESTION, 'next')"
                  class="btn btn-sm"
                  :disabled="
                    currentPage[CATEGORY.SUGGESTION] >=
                    Math.ceil(totalItems[CATEGORY.SUGGESTION] / perPage)
                  "
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal -->
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
import { computed, ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import pocketbase from "@/lib/pocketbase";

const router = useRouter();

// Constants for category types
const CATEGORY = {
  FEEDBACK: 0,
  BUG: 1,
  SUGGESTION: 2,
} as const;

interface FeedbackModel {
  id: string;
  user: string;
  category: number;
  content: string;
  created: string;
  updated: string;
}

// State for pagination
const currentPage = ref({
  [CATEGORY.FEEDBACK]: 1,
  [CATEGORY.BUG]: 1,
  [CATEGORY.SUGGESTION]: 1,
});
const perPage = 5; // Items per page
const totalItems = ref({
  [CATEGORY.FEEDBACK]: 0,
  [CATEGORY.BUG]: 0,
  [CATEGORY.SUGGESTION]: 0,
});

// Reactive data
const feedbackItems = ref<FeedbackModel[]>([]);
const bugItems = ref<FeedbackModel[]>([]);
const suggestionItems = ref<FeedbackModel[]>([]);
const isLoading = ref({
  [CATEGORY.FEEDBACK]: false,
  [CATEGORY.BUG]: false,
  [CATEGORY.SUGGESTION]: false,
});

// Modal state
const showModal = ref(false);
const activeType = ref<"feedback" | "bug" | "suggestion">("feedback");
const newItemContent = ref("");

// Fetch feedback items from PocketBase
const fetchItems = async (category: number, page: number) => {
  try {
    isLoading.value[category] = true;
    const result = await pocketbase.collection("feedback").getList(page, perPage, {
      filter: `category = ${category}`,
      sort: "-created",
      expand: "user",
    });

    return {
      items: result.items,
      total: result.totalItems,
    };
  } catch (error) {
    console.error(`Error fetching category ${category}:`, error);
    return { items: [], total: 0 };
  } finally {
    isLoading.value[category] = false;
  }
};

// Load all categories
const loadAllItems = async () => {
  const [feedback, bugs, suggestions] = await Promise.all([
    fetchItems(CATEGORY.FEEDBACK, currentPage.value[CATEGORY.FEEDBACK]),
    fetchItems(CATEGORY.BUG, currentPage.value[CATEGORY.BUG]),
    fetchItems(CATEGORY.SUGGESTION, currentPage.value[CATEGORY.SUGGESTION]),
  ]);

  feedbackItems.value = feedback.items;
  totalItems.value[CATEGORY.FEEDBACK] = feedback.total;

  bugItems.value = bugs.items;
  totalItems.value[CATEGORY.BUG] = bugs.total;

  suggestionItems.value = suggestions.items;
  totalItems.value[CATEGORY.SUGGESTION] = suggestions.total;
};

// Handle pagination
const changePage = async (category: number, direction: "prev" | "next") => {
  if (direction === "prev" && currentPage.value[category] > 1) {
    currentPage.value[category]--;
  } else if (
    direction === "next" &&
    currentPage.value[category] < Math.ceil(totalItems.value[category] / perPage)
  ) {
    currentPage.value[category]++;
  }

  const result = await fetchItems(category, currentPage.value[category]);
  if (category === CATEGORY.FEEDBACK) {
    feedbackItems.value = result.items;
  } else if (category === CATEGORY.BUG) {
    bugItems.value = result.items;
  } else {
    suggestionItems.value = result.items;
  }
};

// Submit new feedback
const submitItem = async () => {
  if (!newItemContent.value.trim()) return;

  try {
    const category =
      activeType.value === "feedback"
        ? CATEGORY.FEEDBACK
        : activeType.value === "bug"
        ? CATEGORY.BUG
        : CATEGORY.SUGGESTION;

    await pocketbase.collection("feedback").create({
      content: newItemContent.value,
      category,
      user: pocketbase.authStore.model?.id,
    });

    // Refresh the current category
    const result = await fetchItems(category, 1);
    if (category === CATEGORY.FEEDBACK) {
      feedbackItems.value = result.items;
      currentPage.value[CATEGORY.FEEDBACK] = 1;
    } else if (category === CATEGORY.BUG) {
      bugItems.value = result.items;
      currentPage.value[CATEGORY.BUG] = 1;
    } else {
      suggestionItems.value = result.items;
      currentPage.value[CATEGORY.SUGGESTION] = 1;
    }

    closeModal();
  } catch (error) {
    console.error("Error submitting feedback:", error);
    // Handle error (show toast/message)
  }
};

// Format date
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

// Get username from expanded user relation
const getUsername = (item: FeedbackModel) => {
  return item.expand?.user?.name || "Anonymous";
};

// Check authentication and load data
onMounted(async () => {
  if (!pocketbase.authStore.isValid) {
    router.push("/auth");
    return;
  }
  await loadAllItems();
});

// Modal title computed property
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

// Modal functions
const openModal = (type: "feedback" | "bug" | "suggestion") => {
  activeType.value = type;
  newItemContent.value = "";
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
};
</script>

<style scoped>
.card-title {
  margin-bottom: 0;
}
</style>
