import { apiService } from './api.js';

class AuthManager {
    constructor() {
        this.api = apiService;
        this.currentUser = null;
        console.log('✅ AuthManager initialized');
    }

    async init() {
        console.log('🔄 AuthManager init called');
        
        const token = localStorage.getItem('auth_token');
        console.log('🔑 Token from localStorage:', token ? 'Exists' : 'None');
        
        if (token) {
            try {
                console.log('🔐 Verifying token...');
                const result = await this.api.verifyToken();
                console.log('✅ Token verification result:', result.valid ? 'Valid' : 'Invalid');
                
                if (result.valid) {
                    this.currentUser = result.user;
                    console.log('👤 User authenticated:', this.currentUser.email);
                }
            } catch (error) {
                console.log('❌ Token verification failed:', error.message);
                this.logout();
            }
        }
        
        this.updateUI();
    }

    async login(email, password) {
        console.log('🔐 Login attempt:', email);
        try {
            const result = await this.api.login({ email, password });
            console.log('✅ Login result:', result.success ? 'Success' : 'Failed');
            
            if (result.success) {
                this.currentUser = result.user;
                this.updateUI();
                return { success: true, message: 'Prisijungimas sėkmingas!' };
            } else {
                return { success: false, error: result.error || 'Login failed' };
            }
        } catch (error) {
            console.error('❌ Login error:', error);
            return { success: false, error: error.message };
        }
    }

    async register(userData) {
        console.log('📝 Registration attempt:', userData.email);
        try {
            const result = await this.api.register(userData);
            console.log('✅ Registration result:', result.success ? 'Success' : 'Failed');
            
            if (result.success) {
                this.currentUser = result.user;
                this.updateUI();
                return { success: true, message: 'Registracija sėkminga!' };
            } else {
                return { success: false, error: result.error || 'Registration failed' };
            }
        } catch (error) {
            console.error('❌ Registration error:', error);
            return { success: false, error: error.message };
        }
    }

    async logout() {
        console.log('🚪 Logging out...');
        try {
            await this.api.logout();
        } catch (error) {
            console.error('❌ Logout error:', error);
        } finally {
            this.currentUser = null;
            this.api.removeToken();
            this.updateUI();
            window.location.href = 'index.html';
        }
    }

    updateUI() {
        console.log('🎨 Updating UI, authenticated:', this.isAuthenticated());
        
        const authElements = document.querySelectorAll('.auth-element');
        const userElements = document.querySelectorAll('.user-element');
        
        console.log('Auth elements found:', authElements.length);
        console.log('User elements found:', userElements.length);
        
        if (this.isAuthenticated()) {
            authElements.forEach(el => {
                console.log('Hiding auth element');
                el.style.display = 'none';
            });
            userElements.forEach(el => {
                console.log('Showing user element');
                el.style.display = 'block';
            });
            
            const userAvatar = document.querySelector('.user-avatar');
            const userName = document.querySelector('.user-name');
            
            if (userAvatar && this.currentUser) {
                userAvatar.textContent = 
                    this.currentUser.firstName.charAt(0) + 
                    this.currentUser.lastName.charAt(0);
            }
            
            if (userName && this.currentUser) {
                userName.textContent = `Sveiki, ${this.currentUser.firstName}!`;
            }
        } else {
            authElements.forEach(el => {
                console.log('Showing auth element');
                el.style.display = 'block';
            });
            userElements.forEach(el => {
                console.log('Hiding user element');
                el.style.display = 'none';
            });
        }
    }

    isAuthenticated() {
        return this.currentUser !== null;
    }

    getCurrentUser() {
        return this.currentUser;
    }
}

// EKSPORTAS - tik viena eilutė
const authManager = new AuthManager();
export { AuthManager, authManager };