import { store } from '../store.js';

export default {
    template: `
    <aside class="sidebar" :class="{ 'collapsed': collapsed }">
        <div class="sidebar-header">
            <div class="logo-container" @click="toggleCollapse" title="Toggle Sidebar">
                 <img src="/static/img/logo.png" alt="NGO" class="sidebar-logo">
                 <span class="brand-name" v-if="!collapsed">NGO Manager</span>
                 <span v-if="!collapsed" style="margin-left: auto; font-size: 1.2rem; color: var(--primary-color);">◀</span>
                 <span v-else style="margin: 0 auto; font-size: 1.2rem; color: var(--primary-color);">▶</span>
            </div>
        </div>

        <nav class="sidebar-nav">
            <router-link to="/" class="nav-item" active-class="active">
                <span class="icon">🏠</span>
                <span class="label" v-if="!collapsed">Dashboard</span>
            </router-link>

            <template v-if="user">
                 <router-link to="/hr" class="nav-item" active-class="active" v-if="user.role === 'Admin'">
                    <span class="icon">👥</span>
                    <span class="label" v-if="!collapsed">HR Management</span>
                </router-link>

                <router-link to="/employee" class="nav-item" active-class="active">
                    <span class="icon">🧑‍💼</span>
                    <span class="label" v-if="!collapsed">Employees</span>
                </router-link>

                <router-link to="/donor" class="nav-item" active-class="active">
                    <span class="icon">❤️</span>
                    <span class="label" v-if="!collapsed">Donors</span>
                </router-link>

                <router-link to="/volunteer" class="nav-item" active-class="active">
                    <span class="icon">🤝</span>
                    <span class="label" v-if="!collapsed">Volunteers</span>
                </router-link>

                <router-link to="/projects" class="nav-item" active-class="active">
                    <span class="icon">🚀</span>
                    <span class="label" v-if="!collapsed">Projects</span>
                </router-link>

                <router-link to="/finance" class="nav-item" active-class="active">
                    <span class="icon">💰</span>
                    <span class="label" v-if="!collapsed">Finance</span>
                </router-link>

                <router-link to="/analytics" class="nav-item" active-class="active">
                    <span class="icon">📊</span>
                    <span class="label" v-if="!collapsed">Analytics</span>
                </router-link>
            
                <router-link to="/activity_logs" class="nav-item" active-class="active" v-if="user.role === 'Admin'">
                    <span class="icon">📜</span>
                    <span class="label" v-if="!collapsed">Logs</span>
                </router-link>
            </template>
        </nav>

        <div class="sidebar-footer" v-if="user">
            <div class="user-info" v-if="!collapsed">
                <div class="user-avatar">{{ user.name.charAt(0) }}</div>
                <div class="user-details">
                    <span class="user-name">{{ user.name }}</span>
                    <span class="user-role">{{ user.role }}</span>
                </div>
            </div>
            <button @click="$emit('logout')" class="logout-btn" :title="collapsed ? 'Logout' : ''">
                <span class="icon">🚪</span>
                <span class="label" v-if="!collapsed">Logout</span>
            </button>
        </div>
    </aside>
    `,
    props: ['user', 'collapsed'],
    emits: ['logout', 'toggle-sidebar'],
    methods: {
        toggleCollapse() {
            this.$emit('toggle-sidebar');
        }
    }
}
