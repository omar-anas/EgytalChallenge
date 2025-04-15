import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/authContext'; '@/stores/auth';

// Import Page/View Components
import LoginPage from '@/pages/LoginPage.vue';
import SignupPage from '@/pages/SignupPage.vue';
import TasksPage from '@/pages/TasksPage.vue';
import CreateTaskPage from '@/pages/CreateTaskPage.vue';

const routes = [
    {
        path: '/login',
        name: 'Login',
        component: LoginPage,
        meta: { requiresGuest: true } // Only accessible if not logged in
    },
    {
        path: '/signup',
        name: 'Signup',
        component: SignupPage,
         meta: { requiresGuest: true } // Only accessible if not logged in
    },
    {
        // Redirect root to tasks page or handle differently
        path: '/',
        name: 'Home', // Or rename to Tasks for clarity
        component: TasksPage,
        meta: { requiresAuth: true } // Requires authentication
    },
     {
        path: '/tasks/new',
        name: 'CreateTask',
        component: CreateTaskPage,
        meta: { requiresAuth: true } // Requires authentication
    },
    // Add other routes like task editing, profile, etc.
    // {
    //     path: '/tasks/:id/edit',
    //     name: 'EditTask',
    //     component: EditTaskPage, // Create this page
    //     meta: { requiresAuth: true },
    //     props: true // Pass route params as props
    // },
    // Catch-all 404
    // {
    //     path: '/:pathMatch(.*)*',
    //     name: 'NotFound',
    //     component: () => import('@/pages/NotFoundPage.vue') // Lazy load 404
    // }
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL), // Use history mode
    routes,
});

// Navigation Guard
router.beforeEach((to, from, next) => {
    const authStore = useAuthStore(); // Must be called inside function scope
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
    const requiresGuest = to.matched.some(record => record.meta.requiresGuest);

    if (requiresAuth && !authStore.isAuthenticated) {
        // Redirect to login if trying to access protected route without auth
        next({ name: 'Login' });
    } else if (requiresGuest && authStore.isAuthenticated) {
        // Redirect to home if trying to access login/signup while already logged in
        next({ name: 'Home' });
    } else {
        // Otherwise, allow navigation
        next();
    }
});

export default router;