import { store } from '../store.js';

export default {
    template: `
    <div class="glass-container" style="padding: 2rem;">
        <h2 style="margin-bottom: 2rem;">Analytics & Insights</h2>
        
        <div class="analytics-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)); gap: 2rem;">
            
            <!-- Spiritual Growth Section -->
            <div class="card glass-card">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                    <h3>Spiritual Growth</h3>
                    <button class="btn btn-sm btn-primary" @click="showLogModal = true">Log Activity</button>
                </div>
                
                <div style="height: 300px; position: relative;">
                    <canvas id="spiritualChart"></canvas>
                </div>
                
                <h4 style="margin-top: 1.5rem;">Recent Logs</h4>
                <ul style="font-size: 0.9rem; padding-left: 1.2rem; margin-top: 0.5rem; max-height: 150px; overflow-y: auto;">
                    <li v-for="log in spiritualLogs" :key="log.id" style="margin-bottom: 0.5rem;">
                        <strong>{{ log.user_name }}</strong>: {{ log.activity_type }} ({{ log.duration }}m) <br>
                        <small style="color: var(--text-muted)">{{ log.date }} - {{ log.notes }}</small>
                    </li>
                </ul>
            </div>

            <!-- Performance Section -->
            <div class="card glass-card">
                <h3>Performance Metrics</h3>
                <p style="font-size: 0.9rem; color: var(--text-muted); margin-bottom: 1rem;">System activity overview</p>
                
                <div style="height: 300px; position: relative;">
                    <canvas id="performanceChart"></canvas>
                </div>
            </div>
        </div>

        <!-- Log Modal -->
        <teleport to="body">
            <div class="modal" v-if="showLogModal" style="display: flex;">
                <div class="modal-content glass-card">
                    <span class="close" @click="showLogModal = false">&times;</span>
                    <h2>Log Spiritual Activity</h2>
                    <form @submit.prevent="logActivity">
                        <div class="form-group">
                            <label>Activity Type</label>
                            <select v-model="newLog.activity_type" style="width: 100%; padding: 0.5rem; border-radius: 8px;" required>
                                <option value="Prayer">Prayer</option>
                                <option value="Meditation">Meditation</option>
                                <option value="Service">Service</option>
                                <option value="Study">Study</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Duration (minutes)</label>
                            <input type="number" v-model="newLog.duration" required>
                        </div>
                         <div class="form-group">
                            <label>Date</label>
                            <input type="date" v-model="newLog.date">
                        </div>
                        <div class="form-group">
                            <label>Notes</label>
                            <textarea v-model="newLog.notes" rows="2"></textarea>
                        </div>
                        <div class="form-actions">
                            <button type="submit" class="btn btn-primary">Log Entry</button>
                        </div>
                    </form>
                </div>
            </div>
        </teleport>
    </div>
    `,
    data() {
        return {
            spiritualStats: [],
            spiritualLogs: [],
            activityStats: [],
            showLogModal: false,
            newLog: { activity_type: 'Prayer', duration: 30, notes: '', date: new Date().toISOString().split('T')[0] },
            charts: {
                spiritual: null,
                performance: null
            }
        }
    },
    mounted() {
        this.fetchAnalytics();
        this.fetchSpiritualLogs();
    },
    methods: {
        async fetchAnalytics() {
            try {
                const response = await axios.get('/analytics/performance');
                this.activityStats = response.data.activity_stats;
                this.spiritualStats = response.data.spiritual_stats;
                this.renderCharts();
            } catch (error) { console.error("Error fetching analytics", error); }
        },
        async fetchSpiritualLogs() {
            try {
                const response = await axios.get('/analytics/spiritual');
                this.spiritualLogs = response.data;
            } catch (error) { console.error("Error fetching spiritual logs", error); }
        },
        async logActivity() {
            try {
                await axios.post('/analytics/spiritual', this.newLog);
                this.showLogModal = false;
                this.newLog = { activity_type: 'Prayer', duration: 30, notes: '', date: new Date().toISOString().split('T')[0] };
                this.fetchAnalytics();
                this.fetchSpiritualLogs();
            } catch (error) { alert('Failed to log activity'); }
        },
        renderCharts() {
            // Spiritual Chart
            const spiritualCtx = document.getElementById('spiritualChart').getContext('2d');
            if (this.charts.spiritual) this.charts.spiritual.destroy();

            this.charts.spiritual = new Chart(spiritualCtx, {
                type: 'doughnut',
                data: {
                    labels: this.spiritualStats.map(s => s.name),
                    datasets: [{
                        data: this.spiritualStats.map(s => s.total_hours),
                        backgroundColor: [
                            'rgba(99, 102, 241, 0.7)',
                            'rgba(168, 85, 247, 0.7)',
                            'rgba(236, 72, 153, 0.7)',
                            'rgba(16, 185, 129, 0.7)',
                            'rgba(245, 158, 11, 0.7)'
                        ],
                        borderColor: '#ffffff',
                        borderWidth: 2
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { position: 'right' }
                    }
                }
            });

            // Performance Chart
            const perfCtx = document.getElementById('performanceChart').getContext('2d');
            if (this.charts.performance) this.charts.performance.destroy();

            this.charts.performance = new Chart(perfCtx, {
                type: 'bar',
                data: {
                    labels: this.activityStats.map(s => s.name),
                    datasets: [{
                        label: 'Activity Actions',
                        data: this.activityStats.map(s => s.activity_count),
                        backgroundColor: 'rgba(99, 102, 241, 0.6)',
                        borderColor: 'rgba(99, 102, 241, 1)',
                        borderWidth: 1,
                        borderRadius: 4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: { beginAtZero: true }
                    }
                }
            });
        }
    }
}
