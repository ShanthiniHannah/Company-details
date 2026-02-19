import { store } from '../store.js';

export default {
    template: `
    <div class="dashboard-container">
        <div style="margin-bottom: 2rem;">
            <h1 style="font-size: 2rem; margin-bottom: 0.5rem; color: var(--primary-color);">Overview</h1>
            <p style="color: #475569; font-size: 1.1rem;">Welcome back, {{ user?.name }}! Here's what's happening today.</p>
        </div>
        
        <div class="dashboard-grid">
            <!-- HR Module (Admin only) -->
            <div class="dashboard-card" v-if="user?.role === 'Admin'" @click="$router.push('/hr')">
                <div class="card-banner" style="background: linear-gradient(135deg, #a5b4fc, #818cf8);">
                    <div class="card-icon-wrapper glass-icon">👥</div>
                    <div class="watermark-icon">👥</div>
                </div>
                <div class="card-body">
                    <h3 class="card-title">HR Management</h3>
                    <p class="card-desc">Manage Human Resource profiles, access control, and department structures.</p>
                    <div class="card-footer">
                        <span>Manage HR</span>
                        <span class="card-arrow">→</span>
                    </div>
                </div>
            </div>

            <!-- Employee Module (Admin & HR) -->
            <div class="dashboard-card" v-if="['Admin', 'HR'].includes(user?.role)" @click="$router.push('/employee')">
                <div class="card-banner" style="background: linear-gradient(135deg, #93c5fd, #60a5fa);">
                    <div class="card-icon-wrapper glass-icon">🧑‍💼</div>
                    <div class="watermark-icon">🧑‍💼</div>
                </div>
                <div class="card-body">
                    <h3 class="card-title">Employees</h3>
                    <p class="card-desc">Track employee records, assignments, personal details, and performance.</p>
                    <div class="card-footer">
                        <span>View Employees</span>
                        <span class="card-arrow">→</span>
                    </div>
                </div>
            </div>

            <!-- Donor Module (Admin, HR, Donor) -->
            <div class="dashboard-card" v-if="['Admin', 'HR', 'Donor'].includes(user?.role)" @click="$router.push('/donor')">
                <div class="card-banner" style="background: linear-gradient(135deg, #f9a8d4, #f472b6);">
                    <div class="card-icon-wrapper glass-icon">❤️</div>
                     <div class="watermark-icon">❤️</div>
                </div>
                <div class="card-body">
                    <h3 class="card-title">Donors</h3>
                    <p class="card-desc">Manage donor records, track contributions, and maintaining relationships.</p>
                    <div class="card-footer">
                        <span>View Donors</span>
                        <span class="card-arrow">→</span>
                    </div>
                </div>
            </div>

            <!-- Volunteer Module (Admin, HR, Volunteer) -->
            <div class="dashboard-card" v-if="['Admin', 'HR', 'Volunteer'].includes(user?.role)" @click="$router.push('/volunteer')">
                 <div class="card-banner" style="background: linear-gradient(135deg, #fcd34d, #fbbf24);">
                    <div class="card-icon-wrapper glass-icon">🤝</div>
                     <div class="watermark-icon">🤝</div>
                </div>
                <div class="card-body">
                    <h3 class="card-title">Volunteers</h3>
                    <p class="card-desc">Coordinate volunteers, schedule events, and manage beneficiary programs.</p>
                    <div class="card-footer">
                        <span>Manage Volunteers</span>
                        <span class="card-arrow">→</span>
                    </div>
                </div>
            </div>

            <!-- Projects Module (Everyone) -->
             <div class="dashboard-card" @click="$router.push('/projects')">
                 <div class="card-banner" style="background: linear-gradient(135deg, #6ee7b7, #34d399);">
                    <div class="card-icon-wrapper glass-icon">🚀</div>
                     <div class="watermark-icon">🚀</div>
                </div>
                <div class="card-body">
                    <h3 class="card-title">Projects</h3>
                    <p class="card-desc">Monitor ongoing projects, milestones, and impact assessments.</p>
                    <div class="card-footer">
                        <span>View Projects</span>
                        <span class="card-arrow">→</span>
                    </div>
                </div>
            </div>

             <!-- Finance Module (Everyone for now based on routes, likely restricted in real app) -->
             <div class="dashboard-card" @click="$router.push('/finance')">
                 <div class="card-banner" style="background: linear-gradient(135deg, #7dd3fc, #38bdf8);">
                    <div class="card-icon-wrapper glass-icon">💰</div>
                     <div class="watermark-icon">💰</div>
                </div>
                <div class="card-body">
                    <h3 class="card-title">Finance</h3>
                    <p class="card-desc">Track budgets, expenses, and financial reports.</p>
                    <div class="card-footer">
                        <span>View Finance</span>
                        <span class="card-arrow">→</span>
                    </div>
                </div>
            </div>

             <!-- Analytics Module -->
             <div class="dashboard-card" @click="$router.push('/analytics')">
                 <div class="card-banner" style="background: linear-gradient(135deg, #c4b5fd, #a78bfa);">
                    <div class="card-icon-wrapper glass-icon">📊</div>
                     <div class="watermark-icon">📊</div>
                </div>
                <div class="card-body">
                    <h3 class="card-title">Analytics</h3>
                    <p class="card-desc">Visual insights and data visualization of organization performance.</p>
                    <div class="card-footer">
                        <span>View Analytics</span>
                        <span class="card-arrow">→</span>
                    </div>
                </div>
            </div>

            <!-- Logs Module (Admin Only) -->
            <div class="dashboard-card" v-if="user?.role === 'Admin'" @click="$router.push('/activity_logs')">
                 <div class="card-banner" style="background: linear-gradient(135deg, #fca5a5, #f87171);">
                    <div class="card-icon-wrapper glass-icon">📜</div>
                     <div class="watermark-icon">📜</div>
                </div>
                <div class="card-body">
                    <h3 class="card-title">Activity Logs</h3>
                    <p class="card-desc">Audit trails and system activity history for security.</p>
                    <div class="card-footer">
                        <span>View Logs</span>
                        <span class="card-arrow">→</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `,
    setup() {
        return {
            user: store.user
        }
    }
}
