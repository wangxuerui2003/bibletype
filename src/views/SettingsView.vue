<template>
  <div class="min-h-screen bg-base-200 p-6">
    <div class="max-w-3xl mx-auto">
      <h1 class="text-3xl font-bold mb-8">Account Settings</h1>

      <div class="card bg-base-100 shadow-xl">
        <div class="card-body">
          <!-- Avatar Section -->
          <div class="flex flex-col items-center mb-8">
            <div class="avatar mb-4">
              <div class="w-32 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                <img :src="avatarUrl" alt="User avatar" />
              </div>
            </div>
            <input
              type="file"
              ref="avatarInput"
              accept="image/*"
              class="hidden"
              @change="handleAvatarChange"
            />
            <button @click="$refs.avatarInput.click()" class="btn btn-sm btn-outline">
              Change Avatar
            </button>
            <div v-if="avatarUploading" class="mt-2">
              <span class="loading loading-spinner loading-sm"></span>
              <span class="ml-2 text-sm">Uploading...</span>
            </div>
          </div>

          <!-- User Info Form -->
          <div class="space-y-4">
            <div class="form-control">
              <label class="label">
                <span class="label-text">Name</span>
              </label>
              <input
                type="text"
                v-model="form.name"
                placeholder="Your name"
                class="input input-bordered w-full"
              />
            </div>

            <div class="form-control">
              <label class="label">
                <span class="label-text">Email</span>
              </label>
              <input
                type="email"
                v-model="form.email"
                disabled
                class="input input-bordered w-full bg-base-200"
              />
            </div>

            <div class="form-control">
              <label class="label">
                <span class="label-text">Bio</span>
              </label>
              <textarea
                v-model="form.bio"
                placeholder="Tell us about yourself..."
                class="textarea textarea-bordered w-full h-24"
              ></textarea>
            </div>

            <div class="form-control mt-6">
              <button @click="updateProfile" :disabled="isSaving" class="btn btn-primary">
                <span v-if="isSaving" class="loading loading-spinner"></span>
                {{ isSaving ? "Saving..." : "Save Changes" }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import pocketbase from "@/lib/pocketbase";
import { useAuthStore } from "@/stores/auth";

interface UserForm {
  name: string;
  email: string;
  bio: string;
  avatar?: File | null;
}

const form = ref<UserForm>({
  name: "",
  email: "",
  bio: "",
  avatar: null,
});

const authStore = useAuthStore();

const avatarUrl = ref("");
const avatarUploading = ref(false);
const isSaving = ref(false);

// Load user data
onMounted(async () => {
  try {
    if (!authStore.user) return;

    const user = authStore.user;
    form.value = {
      name: user.name || "",
      email: user.email,
      bio: user.bio || "",
    };

    if (user.avatar) {
      avatarUrl.value = pocketbase.files.getUrl(user, user.avatar, {
        thumb: "300x300",
      });
    } else {
      avatarUrl.value = "/default.jpg";
    }
  } catch (error) {
    console.error("Error loading user data:", error);
  }
});

// Handle avatar change
const handleAvatarChange = (e: Event) => {
  const input = e.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    form.value.avatar = input.files[0];
    avatarUploading.value = true;

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      avatarUrl.value = e.target?.result as string;
      avatarUploading.value = false;
    };
    reader.readAsDataURL(input.files[0]);
  }
};

// Update profile
const updateProfile = async () => {
  if (!authStore.user) return;

  isSaving.value = true;
  try {
    const data: any = {
      name: form.value.name,
      bio: form.value.bio,
    };

    // Handle avatar upload if changed
    if (form.value.avatar) {
      const formData = new FormData();
      formData.append("avatar", form.value.avatar);
      const record = await pocketbase
        .collection("users")
        .update(pocketbase.authStore.record.id, formData);
      data.avatar = record.avatar;
    }

    // Update other fields
    await pocketbase.collection("users").update(pocketbase.authStore.record.id, data);

    // Refresh auth store
    authStore.authRefresh();

    // Show success
    alert("Profile updated successfully!");
  } catch (error) {
    console.error("Error updating profile:", error);
    alert("Failed to update profile. Please try again.");
  } finally {
    isSaving.value = false;
  }
};
</script>

<style scoped>
.avatar img {
  transition: transform 0.3s ease;
}
.avatar:hover img {
  transform: scale(1.05);
}
</style>
