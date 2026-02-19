export default {
    template: `
    <div class="card glass-card">
        <div class="card-header">
            <h3>System Activity Logs</h3>
            <button class="btn btn-secondary" @click="fetchLogs">Refresh</button>
        </div>
        
        <div class="table-container">
            <table>
                <thead>
                    <tr>
                        <th>Time</th>
                        <th>User</th>
                        <th>Action</th>
                        <th>Details</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-if="logs.length === 0">
                        <td colspan="4" style="text-align: center;">No activity recorded</td>
                    </tr>
                    <tr v-for="log in logs" :key="log.id">
                        <td>{{ log.timestamp }}</td>
                        <td>{{ log.user }}</td>
                        <td><span :class="'badge ' + getBadgeClass(log.action)">{{ log.action }}</span></td>
                        <td>{{ log.details }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
    `,
    data() {
        return {
            logs: []
        }
    },
    mounted() {
        this.fetchLogs();
    },
    methods: {
        async fetchLogs() {
            try {
                const response = await axios.get('/activity_logs');
                this.logs = response.data;
            } catch (error) {
                console.error('Error fetching logs', error);
                if (error.response?.status === 403) {
                    alert("Access Denied: Admin only.");
                    this.$router.push('/');
                }
            }
        },
        getBadgeClass(action) {
            if (action.includes('ADD')) return 'badge-success'; // We'll add this class to CSS
            if (action.includes('DELETE')) return 'badge-danger';
            return 'badge-primary';
        }
    }
}
