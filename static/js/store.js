const { reactive } = Vue;

export const store = reactive({
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || null,

    setUser(user, token) {
        this.user = user;
        this.token = token;
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('token', token);
        // We can't set axios headers here if axios isn't imported, 
        // but typically axios is global from CDN. 
        // If it was module-based, we'd need to import it.
        // Since we use CDN axios, it is window.axios.
        if (window.axios) {
            window.axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
    },

    clearUser() {
        this.user = null;
        this.token = null;
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        if (window.axios) {
            delete window.axios.defaults.headers.common['Authorization'];
        }
    }
});
