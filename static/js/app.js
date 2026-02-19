import Login from './components/Login.js';
import Dashboard from './components/Dashboard.js';
import HRManager from './components/HRManager.js';
import EmployeeManager from './components/EmployeeManager.js';
import DonorManager from './components/DonorManager.js';
import VolunteerManager from './components/VolunteerManager.js';
import ProjectManager from './components/ProjectManager.js';
import FinanceManager from './components/FinanceManager.js';
import AnalyticsDashboard from './components/AnalyticsDashboard.js';
import ActivityLogs from './components/ActivityLogs.js';

const { createApp, reactive, computed } = Vue;
const { createRouter, createWebHashHistory } = VueRouter;

import { store } from './store.js';

// Global State (Moved to store.js)
// const store = reactive({...});

// Axios Config
axios.defaults.baseURL = ''; // Same origin
if (store.token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${store.token}`;
}

// Router
const routes = [
    { path: '/login', component: Login, meta: { guest: true } },
    { path: '/', component: Dashboard, meta: { requiresAuth: true } },
    { path: '/hr', component: HRManager, meta: { requiresAuth: true, role: 'Admin' } },
    { path: '/employee', component: EmployeeManager, meta: { requiresAuth: true } },
    { path: '/donor', component: DonorManager, meta: { requiresAuth: true } },
    { path: '/volunteer', component: VolunteerManager, meta: { requiresAuth: true } },
    { path: '/projects', component: ProjectManager, meta: { requiresAuth: true } },
    { path: '/finance', component: FinanceManager, meta: { requiresAuth: true } },
    { path: '/analytics', component: AnalyticsDashboard, meta: { requiresAuth: true } },
    { path: '/activity_logs', component: ActivityLogs, meta: { requiresAuth: true, role: 'Admin' } },
];

const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

// Guard
router.beforeEach((to, from, next) => {
    if (to.meta.requiresAuth && !store.token) {
        next('/login');
    } else if (to.meta.guest && store.token) {
        next('/');
    } else {
        // Simple role check
        if (to.meta.role && store.user && store.user.role !== to.meta.role && store.user.role !== 'Admin') {
            alert('Access Denied');
            next('/');
        } else {
            next();
        }
    }
});


import Sidebar from './components/Sidebar.js';

// ... (imports)

// App
const app = createApp({
    setup() {
        const user = computed(() => store.user);
        const isLoginPage = computed(() => router.currentRoute.value.path === '/login');
        const isSidebarCollapsed = Vue.ref(false);

        const logout = () => {
            store.clearUser();
            router.push('/login');
        };

        const toggleSidebar = () => {
            isSidebarCollapsed.value = !isSidebarCollapsed.value;
        };

        // Verify Token on Load
        const checkAuth = async () => {
            if (store.token) {
                try {
                    await axios.get('/check-auth');
                } catch (error) {
                    console.log("Token invalid, logging out...");
                    logout();
                }
            }
        };
        checkAuth();

        return {
            user,
            logout,
            isLoginPage,
            isSidebarCollapsed,
            toggleSidebar
        };
    }
});

app.component('sidebar-component', Sidebar);
app.use(router);
app.mount('#app');


// export { store };
