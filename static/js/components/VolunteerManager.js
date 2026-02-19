import { store } from '../store.js';
export default {
    template: `
    <div class="card glass-card">
        <div class="card-header">
            <h3>{{ activeTab === 'volunteers' ? 'Volunteers' : 'Beneficiaries' }}</h3>
            <div style="display: flex; gap: 1rem;">
                <button class="btn btn-sm" :class="activeTab === 'volunteers' ? 'btn-primary' : 'btn-secondary'" @click="activeTab = 'volunteers'">Volunteers</button>
                <button class="btn btn-sm" :class="activeTab === 'beneficiaries' ? 'btn-primary' : 'btn-secondary'" @click="activeTab = 'beneficiaries'">Beneficiaries</button>
            </div>
            <button class="btn btn-primary" @click="showModal = true">Add New</button>
        </div>
        
        <!-- Volunteers Table -->
        <div class="table-container" v-if="activeTab === 'volunteers'">
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Skills</th>
                    </tr>
                </thead>
                <tbody>
                     <tr v-if="volunteers.length === 0">
                        <td colspan="4" style="text-align: center;">No Volunteers found</td>
                    </tr>
                    <tr v-for="v in volunteers" :key="v.id">
                        <td>{{ v.id }}</td>
                        <td>{{ v.name }}</td>
                        <td>{{ v.email }}</td>
                        <td>{{ v.skills || '-' }}</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Beneficiaries Table -->
        <div class="table-container" v-if="activeTab === 'beneficiaries'">
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Status</th>
                        <th>Needs</th>
                    </tr>
                </thead>
                <tbody>
                     <tr v-if="beneficiaries.length === 0">
                        <td colspan="4" style="text-align: center;">No Beneficiaries found</td>
                    </tr>
                    <tr v-for="b in beneficiaries" :key="b.id">
                        <td>{{ b.id }}</td>
                        <td>{{ b.name }}</td>
                        <td>{{ b.status }}</td>
                        <td>{{ b.needs || '-' }}</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Modal -->
        <teleport to="body">
            <div class="modal" v-if="showModal" style="display: flex;">
                <div class="modal-content glass-card">
                    <span class="close" @click="showModal = false">&times;</span>
                    <h2>Add {{ activeTab === 'volunteers' ? 'Volunteer' : 'Beneficiary' }}</h2>
                    
                    <form v-if="activeTab === 'volunteers'" @submit.prevent="addVolunteer">
                        <div class="form-group">
                            <label>Name</label>
                            <input type="text" v-model="newVol.name" required>
                        </div>
                        <div class="form-group">
                            <label>Email</label>
                            <input type="email" v-model="newVol.email" required>
                        </div>
                        <div class="form-group">
                            <label>Skills</label>
                            <input type="text" v-model="newVol.skills">
                        </div>
                        <div class="form-actions">
                            <button type="submit" class="btn btn-primary">Create Volunteer</button>
                        </div>
                    </form>

                    <form v-else @submit.prevent="addBeneficiary">
                        <div class="form-group">
                            <label>Name</label>
                            <input type="text" v-model="newBen.name" required>
                        </div>
                        <div class="form-group">
                            <label>Needs</label>
                            <textarea v-model="newBen.needs" rows="3" style="width: 100%; border-radius: 8px; padding: 0.5rem;"></textarea>
                        </div>
                        <div class="form-actions">
                            <button type="submit" class="btn btn-primary">Create Beneficiary</button>
                        </div>
                    </form>
                </div>
            </div>
        </teleport>
    </div>
    `,
    data() {
        return {
            activeTab: 'volunteers',
            volunteers: [],
            beneficiaries: [],
            showModal: false,
            newVol: { name: '', email: '', skills: '' },
            newBen: { name: '', needs: '' }
        }
    },
    mounted() {
        this.fetchVolunteers();
        this.fetchBeneficiaries();
    },
    methods: {
        async fetchVolunteers() {
            try {
                const response = await axios.get('/volunteer');
                this.volunteers = response.data;
            } catch (error) { console.error(error); }
        },
        async fetchBeneficiaries() {
            try {
                const response = await axios.get('/beneficiary');
                this.beneficiaries = response.data;
            } catch (error) { console.error(error); }
        },
        async addVolunteer() {
            try {
                await axios.post('/volunteer', this.newVol);
                this.showModal = false;
                this.newVol = { name: '', email: '', skills: '' };
                this.fetchVolunteers();
            } catch (error) { alert('Failed to add volunteer'); }
        },
        async addBeneficiary() {
            try {
                await axios.post('/beneficiary', this.newBen);
                this.showModal = false;
                this.newBen = { name: '', needs: '' };
                this.fetchBeneficiaries();
            } catch (error) { alert('Failed to add beneficiary'); }
        }
    }
}
