import { store } from '../store.js';

export default {
    template: `
    <div class="card glass-card">
        <div class="card-header">
            <h3>Project Management</h3>
            <button class="btn btn-primary" @click="showProjectModal = true">New Project</button>
        </div>

        <div class="projects-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.5rem; margin-top: 1rem;">
            <div v-for="p in projects" :key="p.id" class="card" style="background: rgba(255,255,255,0.05);">
                <div style="display: flex; justify-content: space-between; align-items: start;">
                    <h4>{{ p.name }}</h4>
                    <span :class="'status-badge status-' + p.status.toLowerCase().replace(' ', '-')">{{ p.status }}</span>
                </div>
                <p style="font-size: 0.9rem; color: var(--text-muted); margin: 0.5rem 0;">{{ p.description || 'No description' }}</p>
                <div style="font-size: 0.85rem; margin-bottom: 0.5rem;">
                    <div>Budget: \${{ p.budget }}</div>
                    <div>Timeline: {{ p.start_date || 'N/A' }} - {{ p.end_date || 'N/A' }}</div>
                </div>
                
                <div class="deliverables-section" style="margin-top: 1rem; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 0.5rem;">
                    <h5 style="margin-bottom: 0.5rem;">Deliverables</h5>
                    <ul style="padding-left: 1.2rem; font-size: 0.9rem; margin-bottom: 0.5rem;">
                        <li v-for="d in p.deliverables" :key="d.id" style="margin-bottom: 0.2rem;">
                            <div style="display: flex; justify-content: space-between;">
                                <span>{{ d.title }}</span>
                                <span style="font-size: 0.7em;" :class="d.status === 'Completed' ? 'text-success' : 'text-warning'">{{ d.status }}</span>
                            </div>
                        </li>
                    </ul>
                    <button class="btn btn-sm btn-secondary" style="width: 100%;" @click="openDeliverableModal(p)">+ Add Deliverable</button>
                </div>
            </div>
            
            <div v-if="projects.length === 0" style="grid-column: 1/-1; text-align: center; padding: 2rem;">
                No projects found.
            </div>
        </div>

        <!-- Project Modal -->
        <teleport to="body">
            <div class="modal" v-if="showProjectModal" style="display: flex;">
                <div class="modal-content glass-card">
                    <span class="close" @click="showProjectModal = false">&times;</span>
                    <h2>New Project</h2>
                    <form @submit.prevent="createProject">
                        <div class="form-group">
                            <label>Name</label>
                            <input type="text" v-model="newProject.name" required>
                        </div>
                        <div class="form-group">
                            <label>Description</label>
                            <textarea v-model="newProject.description" rows="2"></textarea>
                        </div>
                        <div class="form-group">
                            <label>Budget</label>
                            <input type="number" v-model="newProject.budget">
                        </div>
                        <div style="display: flex; gap: 1rem;">
                            <div class="form-group" style="flex:1">
                                <label>Start Date</label>
                                <input type="date" v-model="newProject.start_date">
                            </div>
                            <div class="form-group" style="flex:1">
                                <label>End Date</label>
                                <input type="date" v-model="newProject.end_date">
                            </div>
                        </div>
                        <div class="form-actions">
                            <button type="submit" class="btn btn-primary">Create Project</button>
                        </div>
                    </form>
                </div>
            </div>
        </teleport>

        <!-- Deliverable Modal -->
        <teleport to="body">
            <div class="modal" v-if="showDeliverableModal" style="display: flex;">
                <div class="modal-content glass-card">
                    <span class="close" @click="showDeliverableModal = false">&times;</span>
                    <h2>Add Deliverable to {{ selectedProject?.name }}</h2>
                    <form @submit.prevent="createDeliverable">
                        <div class="form-group">
                            <label>Title</label>
                            <input type="text" v-model="newDeliverable.title" required>
                        </div>
                        <div class="form-group">
                            <label>Due Date</label>
                            <input type="date" v-model="newDeliverable.due_date">
                        </div>
                        <div class="form-actions">
                            <button type="submit" class="btn btn-primary">Add Deliverable</button>
                        </div>
                    </form>
                </div>
            </div>
        </teleport>
    </div>
    `,
    data() {
        return {
            projects: [],
            showProjectModal: false,
            showDeliverableModal: false,
            selectedProject: null,
            newProject: { name: '', description: '', budget: 0, start_date: '', end_date: '' },
            newDeliverable: { title: '', due_date: '' }
        }
    },
    mounted() {
        this.fetchProjects();
    },
    methods: {
        async fetchProjects() {
            try {
                const response = await axios.get('/projects');
                this.projects = response.data;
            } catch (error) { console.error("Error fetching projects", error); }
        },
        async createProject() {
            try {
                await axios.post('/projects', this.newProject);
                this.showProjectModal = false;
                this.newProject = { name: '', description: '', budget: 0, start_date: '', end_date: '' };
                this.fetchProjects();
            } catch (error) { alert('Failed to create project'); }
        },
        openDeliverableModal(project) {
            this.selectedProject = project;
            this.showDeliverableModal = true;
        },
        async createDeliverable() {
            try {
                await axios.post(`/projects/${this.selectedProject.id}/deliverables`, this.newDeliverable);
                this.showDeliverableModal = false;
                this.newDeliverable = { title: '', due_date: '' };
                this.fetchProjects();
            } catch (error) { alert('Failed to add deliverable'); }
        }
    }
}
