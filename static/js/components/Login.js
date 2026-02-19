import { store } from '../store.js';

export default {
    template: `
    <div style="display: flex; align-items: center; justify-content: center; min-height: 80vh;">
        <div class="glass-card login-card" style="width: 100%; max-width: 400px; padding: 2rem;">
            <div style="text-align: center; margin-bottom: 2rem;">
                <h2>NGO Login</h2>
                <p style="color: var(--text-muted)">Please sign in to continue</p>
            </div>
            <form @submit.prevent="handleLogin">
                <div class="form-group">
                    <label for="email">Email</label>
                    <input type="email" id="email" v-model="email" required placeholder="admin@example.com">
                </div>
                <div class="form-group">
                    <label for="password">Password</label>
                    <input type="password" id="password" v-model="password" required placeholder="••••••••">
                </div>
                
                <div v-if="error" style="color: red; margin-bottom: 1rem; text-align: center;">{{ error }}</div>
                
                <div class="form-actions">
                    <button type="submit" class="btn btn-primary" style="width: 100%; justify-content: center;" :disabled="loading">
                        {{ loading ? 'Signing In...' : 'Sign In' }}
                    </button>
                </div>
            </form>
            <div style="margin-top: 1rem; text-align: center; font-size: 0.9rem;">
                <p><strong>Admin:</strong> admin@test.com / 123456</p>
                <p><strong>Employee:</strong> Use email / 123456</p>
            </div>
        </div>
    </div>
    `,
    data() {
        return {
            email: '',
            password: '',
            error: null,
            loading: false
        }
    },
    methods: {
        async handleLogin() {
            this.loading = true;
            this.error = null;

            try {
                const response = await axios.post('/login', {
                    email: this.email,
                    password: this.password
                });

                const { user, token } = response.data;
                store.setUser(user, token);
                this.$router.push('/');

            } catch (err) {
                this.error = err.response?.data?.error || 'Login failed';
            } finally {
                this.loading = false;
            }
        }
    }
}
