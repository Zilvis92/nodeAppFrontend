class ApiService {
    constructor() {
        this.baseURL = 'http://localhost:3001/api';
        this.token = localStorage.getItem('auth_token');
        console.log('✅ ApiService initialized, baseURL:', this.baseURL);
    }

    setToken(token) {
        this.token = token;
        localStorage.setItem('auth_token', token);
        console.log('🔑 Token saved to localStorage');
    }

    removeToken() {
        this.token = null;
        localStorage.removeItem('auth_token');
        console.log('🔑 Token removed from localStorage');
    }

    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        
        console.log('🌐 API Request:', url, options.method || 'GET');
        
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        };

        if (this.token) {
            config.headers['Authorization'] = `Bearer ${this.token}`;
            console.log('🔐 Adding Authorization header');
        }

        try {
            const response = await fetch(url, config);
            const data = await response.json();

            console.log('📡 API Response:', data);

            if (!response.ok) {
                throw new Error(data.error || 'Request failed');
            }

            return data;
        } catch (error) {
            console.error('❌ API request failed:', error);
            throw error;
        }
    }

    // Auth methods
    async register(userData) {
        return this.request('/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData)
        });
    }

    async login(credentials) {
        const result = await this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify(credentials)
        });
        
        if (result.success && result.token) {
            this.setToken(result.token);
        }
        
        return result;
    }

    async logout() {
        await this.request('/auth/logout', { method: 'POST' });
        this.removeToken();
    }

    async verifyToken() {
        const token = localStorage.getItem('auth_token');
        if (!token) {
            throw new Error('No token found');
        }
        return this.request('/auth/verify', {
            method: 'POST',
            body: JSON.stringify({ token: token })
        });
    }

    // Blog methods
    async getBlogs() {
        return this.request('/blogs');
    }

    async getBlog(id) {
        return this.request(`/blogs/${id}`);
    }

    async createBlog(blogData) {
        return this.request('/blogs', {
            method: 'POST',
            body: JSON.stringify(blogData)
        });
    }

    async updateBlog(id, blogData) {
        return this.request(`/blogs/${id}`, {
            method: 'PUT',
            body: JSON.stringify(blogData)
        });
    }

    async deleteBlog(id) {
        return this.request(`/blogs/${id}`, {
            method: 'DELETE'
        });
    }
}

// EKSPORTAS
const apiService = new ApiService();
export { ApiService, apiService };