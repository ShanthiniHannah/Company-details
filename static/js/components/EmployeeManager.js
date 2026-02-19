import { store } from '../store.js';

export default {
    template: `
    <div class="card glass-card">
        <div class="card-header">
            <h3>Employee Roster</h3>
            <button class="btn btn-secondary" @click="openModal">Add Employee</button>
        </div>
        
        <div class="table-container">
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Age</th>
                        <th>Gender</th>
                        <th>HR Manager</th>
                        <th>Sponsor</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-if="employees.length === 0">
                        <td colspan="7" style="text-align: center;">No Employee records found</td>
                    </tr>
                    <tr v-for="emp in employees" :key="emp.id">
                        <td>{{ emp.id }}</td>
                        <td>{{ emp.name }}</td>
                        <td>{{ emp.age || '-' }}</td>
                        <td>{{ emp.gender || '-' }}</td>
                        <td>{{ emp.hr_name || 'Unassigned' }}</td>
                        <td>{{ emp.sponsor || '-' }}</td>
                        <td>
                            <button class="btn btn-sm btn-danger" @click="deleteEmployee(emp.id)">Delete</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Modal -->
        <teleport to="body">
            <div class="modal" v-if="showModal" style="display: flex;">
                <div class="modal-content glass-card">
                    <span class="close" @click="showModal = false">&times;</span>
                    <h2>Add New Employee</h2>
                    <form @submit.prevent="addEmployee">
                        <div class="form-group">
                            <label>Name</label>
                            <input type="text" v-model="newEmp.name" required>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label>Age</label>
                                <input type="number" v-model="newEmp.age">
                            </div>
                            <div class="form-group">
                                <label>Gender</label>
                                <select v-model="newEmp.gender">
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                        </div>
                        <div class="form-group">
                            <label>Address</label>
                            <input type="text" v-model="newEmp.address">
                        </div>
                        <div class="form-group">
                            <label>Sponsor</label>
                            <input type="text" v-model="newEmp.sponsor">
                        </div>
                        <div class="form-group">
                            <label>Assign HR</label>
                            <select v-model="newEmp.hr_id">
                                <option :value="null">Unassigned</option>
                                <option v-for="hr in hrs" :key="hr.id" :value="hr.id">{{ hr.name }} ({{ hr.email }})</option>
                            </select>
                        </div>
                        <div class="form-actions">
                            <button type="submit" class="btn btn-secondary">Create</button>
                        </div>
                    </form>
                </div>
            </div>
        </teleport>
    </div>
    `,
    data() {
        return {
            employees: [],
            hrs: [],
            showModal: false,
            newEmp: {
                name: '',
                age: null,
                gender: 'Male',
                address: '',
                sponsor: '',
                hr_id: null
            }
        }
    },
    mounted() {
        this.fetchEmployees();
    },
    methods: {
        async fetchEmployees() {
            try {
                const response = await axios.get('/employee');
                this.employees = response.data;
            } catch (error) {
                console.error('Error fetching Employees', error);
            }
        },
        async fetchHRs() {
            try {
                const response = await axios.get('/hr');
                this.hrs = response.data;
            } catch (error) {
                console.error('Error fetching HRs', error);
            }
        },
        openModal() {
            this.fetchHRs();
            this.showModal = true;
        },
        async addEmployee() {
            try {
                await axios.post('/employee', this.newEmp);
                this.showModal = false;
                this.newEmp = { name: '', age: null, gender: 'Male', address: '', sponsor: '', hr_id: null };
                this.fetchEmployees();
            } catch (error) {
                alert(error.response?.data?.error || 'Failed to add Employee');
            }
        },
        async deleteEmployee(id) {
            if (!confirm('Are you sure?')) return;
            try {
                await axios.delete(`/employee/${id}`);
                this.fetchEmployees();
            } catch (error) {
                alert(error.response?.data?.error || 'Failed to delete Employee');
            }
        }
    }
}
