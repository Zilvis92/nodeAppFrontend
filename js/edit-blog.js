import { authManager } from './auth.js';
import { apiService } from './api.js';

class EditBlogManager {
    constructor() {
        this.blogId = null;
    }

    async init() {
        await authManager.init();
        
        if (!authManager.isAuthenticated()) {
            window.location.href = 'login.html';
            return;
        }
        
        const urlParams = new URLSearchParams(window.location.search);
        this.blogId = urlParams.get('id');
        
        if (!this.blogId) {
            this.showError('Naujienos ID nerastas');
            return;
        }
        
        await this.loadBlog();
        this.setupEventListeners();
    }

    async loadBlog() {
        try {
            const result = await apiService.getBlog(this.blogId);
            
            if (result.success) {
                this.displayForm(result.data);
            } else {
                this.showError('Naujiena nerasta');
            }
        } catch (error) {
            this.showError('Nepavyko įkelti naujienos: ' + error.message);
        }
    }

    displayForm(blog) {
        document.getElementById('loading-message').style.display = 'none';
        document.getElementById('edit-blog-form').style.display = 'block';
        
        document.getElementById('title').value = blog.title;
        document.getElementById('santrauka').value = blog.santrauka;
        document.getElementById('body').value = blog.body;
    }

    setupEventListeners() {
        const editForm = document.getElementById('edit-blog-form');
        const cancelButton = document.getElementById('cancel-button');
        
        editForm.addEventListener('submit', (e) => this.handleSubmit(e));
        cancelButton.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = `blog.html?id=${this.blogId}`;
        });
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        const blogData = {
            title: document.getElementById('title').value,
            santrauka: document.getElementById('santrauka').value,
            body: document.getElementById('body').value
        };
        
        const submitBtn = e.target.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Atnaujinama...';
        
        try {
            const result = await apiService.updateBlog(this.blogId, blogData);
            
            if (result.success) {
                this.showMessage('Naujiena sėkmingai atnaujinta!', 'success');
                setTimeout(() => {
                    window.location.href = `blog.html?id=${this.blogId}`;
                }, 1500);
            } else {
                this.showMessage('Klaida: ' + result.error, 'error');
            }
        } catch (error) {
            this.showMessage('Įvyko klaida: ' + error.message, 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Atnaujinti naujieną';
        }
    }

    showMessage(message, type) {
        const messageContainer = document.getElementById('message-container');
        messageContainer.innerHTML = `<div class="${type}-message">${message}</div>`;
    }

    showError(message) {
        const loading = document.getElementById('loading-message');
        if (loading) loading.style.display = 'none';
        this.showMessage(message, 'error');
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    const editBlogManager = new EditBlogManager();
    await editBlogManager.init();
});