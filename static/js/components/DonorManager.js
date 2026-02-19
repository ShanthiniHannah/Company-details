import { store } from '../store.js';

export default {
    template: `
    <div class="card glass-card">
        <div class="card-header">
            <h3>Donor Management</h3>
            <button class="btn btn-primary" @click="showModal = true">Add Donor</button>
        </div>
        
        <div class="table-container">
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Donation Amount</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-if="donors.length === 0">
                        <td colspan="5" style="text-align: center;">No Donor records found</td>
                    </tr>
                    <tr v-for="d in donors" :key="d.id">
                        <td>{{ d.id }}</td>
                        <td>{{ d.name }}</td>
                        <td>{{ d.email }}</td>
                        <td>{{ d.phone || '-' }}</td>
                        <td>\${{ d.donation_amount }}</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Modal -->
        <div class="modal" v-if="showModal" style="display: flex;">
            <div class="modal-content glass-card">
                <span class="close" @click="showModal = false">&times;</span>
                <h2>Add New Donor</h2>
                <form @submit.prevent="addDonor">
                    <div class="form-group">
                        <label>Name</label>
                        <input type="text" v-model="newDonor.name" required>
                    </div>
                    <div class="form-group">
                        <label>Email</label>
                        <input type="email" v-model="newDonor.email" required>
                    </div>
                    <div class="form-group">
                        <label>Phone</label>
                        <input type="text" v-model="newDonor.phone">
                    </div>
                     <div class="form-group">
                        <label>Donation Amount</label>
                        <input type="number" v-model="newDonor.donation_amount" step="0.01">
                    </div>
                    <div class="form-actions">
                        <button type="submit" class="btn btn-primary">Create</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
    `,
    data() {
        return {
            donors: [],
            showModal: false,
            newDonor: {
                name: '',
                email: '',
                phone: '',
                donation_amount: 0
            }
        }
    },
    mounted() {
        this.fetchDonors();
    },
    methods: {
        async fetchDonors() {
            try {
                const response = await axios.get('/donor');
                this.donors = response.data;
            } catch (error) {
                console.error('Error fetching Donors', error);
            }
        },
        async addDonor() {
            try {
                await axios.post('/donor', this.newDonor);
                this.showModal = false;
                this.newDonor = { name: '', email: '', phone: '', donation_amount: 0 };
                this.fetchDonors();
            } catch (error) {
                alert(error.response?.data?.error || 'Failed to add Donor');
            }
        }
    }
}
