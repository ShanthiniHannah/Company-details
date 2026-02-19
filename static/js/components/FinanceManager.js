import { store } from '../store.js';

export default {
    template: `
    <div class="card glass-card">
        <div class="card-header">
            <h3>Finance Management</h3>
            <button class="btn btn-primary" @click="showSponsorshipModal = true">Record Sponsorship</button>
        </div>

        <div class="table-container">
            <table>
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Sponsor</th>
                        <th>Amount</th>
                        <th>Project / Fund</th>
                        <th>Receipt</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-if="sponsorships.length === 0">
                        <td colspan="5" style="text-align: center;">No sponsorships recorded</td>
                    </tr>
                    <tr v-for="s in sponsorships" :key="s.id">
                        <td>{{ s.date }}</td>
                        <td>{{ s.sponsor_name }} <small v-if="s.donor_name !== 'Anonymous'">({{ s.donor_name }})</small></td>
                        <td>\${{ s.amount }}</td>
                        <td>{{ s.project_name }}</td>
                        <td>
                            <button class="btn btn-sm btn-secondary" @click="generateReceipt(s.id)">Download</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Sponsorship Modal -->
        <teleport to="body">
            <div class="modal" v-if="showSponsorshipModal" style="display: flex;">
                <div class="modal-content glass-card">
                    <span class="close" @click="showSponsorshipModal = false">&times;</span>
                    <h2>Record New Sponsorship</h2>
                    <form @submit.prevent="addSponsorship">
                        <div class="form-group">
                            <label>Sponsor Name</label>
                            <input type="text" v-model="newSponsorship.sponsor_name" required>
                        </div>
                        <div class="form-group">
                            <label>Amount (\$)</label>
                            <input type="number" step="0.01" v-model="newSponsorship.amount" required>
                        </div>
                        <div class="form-group">
                            <label>Link to Project (Optional)</label>
                            <select v-model="newSponsorship.project_id" style="width: 100%; padding: 0.5rem; border-radius: 8px;">
                                <option :value="null">General Fund</option>
                                <option v-for="p in projects" :value="p.id">{{ p.name }}</option>
                            </select>
                        </div>
                        <div class="form-actions">
                            <button type="submit" class="btn btn-primary">Record</button>
                        </div>
                    </form>
                </div>
            </div>
        </teleport>
    </div>
    `,
    data() {
        return {
            sponsorships: [],
            projects: [],
            showSponsorshipModal: false,
            newSponsorship: { sponsor_name: '', amount: '', project_id: null }
        }
    },
    mounted() {
        this.fetchSponsorships();
        this.fetchProjects();
    },
    methods: {
        async fetchSponsorships() {
            try {
                const response = await axios.get('/sponsorships');
                this.sponsorships = response.data;
            } catch (error) { console.error("Error fetching sponsorships", error); }
        },
        async fetchProjects() {
            try {
                const response = await axios.get('/projects');
                this.projects = response.data;
            } catch (error) { console.error("Error fetching projects", error); }
        },
        async addSponsorship() {
            try {
                await axios.post('/sponsorships', this.newSponsorship);
                this.showSponsorshipModal = false;
                this.newSponsorship = { sponsor_name: '', amount: '', project_id: null };
                this.fetchSponsorships();
            } catch (error) { alert('Failed to record sponsorship'); }
        },
        async generateReceipt(id) {
            try {
                const response = await axios.get(`/receipt/${id}`);
                // In a real app we would trigger a file download. 
                // Here we just show the content or mock a download.
                alert("Receipt Generated! (Mock download started)\n\n" + response.data.content);

                // create a blob and download
                const blob = new Blob([response.data.content], { type: 'text/plain' });
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = `receipt_${id}.txt`;
                link.click();

            } catch (error) { alert('Failed to generate receipt'); }
        }
    }
}
