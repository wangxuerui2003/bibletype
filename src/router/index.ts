import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import AuthView from "../views/AuthView.vue";
import pocketbase from "@/lib/pocketbase";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
      meta: { requiresAuth: true },
    },
    {
      path: "/faq",
      name: "FAQs",
      // route level code-splitting
      // which is lazy-loaded when the route is visited.
      component: () => import("../views/FAQView.vue"),
    },
    {
      path: "/auth",
      name: "auth",
      component: AuthView,
    },
  ],
});

// Navigation guard
router.beforeEach((to, from, next) => {
  const isAuthenticated = pocketbase.authStore.isValid;

  if (to.matched.some((record) => record.meta.requiresAuth) && !isAuthenticated) {
    // Redirect to auth page if route requires auth and user is not authenticated
    next({ name: "auth" });
  } else {
    // Otherwise proceed
    next();
  }
});

export default router;
