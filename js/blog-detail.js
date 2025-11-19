import { authManager } from './auth.js';
import { apiService } from './api.js';

class BlogDetailManager {
    constructor() {
        this.blogId = null;
        this.blog = null;
    }

    async init() {
        await authManager.init();
        
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
                this.blog = result.data;
                this.displayBlog();
                this.toggleActionButtons();
            } else {
                this.showError('Naujiena nerasta');
            }
        } catch (error) {
            this.showError('Nepavyko įkelti naujienos: ' + error.message);
        }
    }

    displayBlog() {
        document.getElementById('loading-message').style.display = 'none';
        document.getElementById('blog-content').style.display = 'block';
        
        document.getElementById('blog-title').textContent = this.blog.title;
        document.getElementById('blog-title-heading').textContent = this.blog.title;
        document.getElementById('blog-santrauka').textContent = this.blog.santrauka;
        document.getElementById('blog-body-content').textContent = this.blog.body;
        
        const date = new Date(this.blog.date).toLocaleDateString('lt-LT');
        document.getElementById('blog-meta').innerHTML = `Sukurta: <time datetime="${this.blog.date}">${date}</time>`;
    }

    toggleActionButtons() {
        const actionButtons = document.getElementById('blog-action-buttons');
        
        if (authManager.isAuthenticated()) {
            actionButtons.style.display = 'flex';
            
            // Nustatyti redagavimo mygtuko nuorodą
            const editButton = document.getElementById('edit-blog-btn');
            editButton.href = `edit-blog.html?id=${this.blogId}`;
        }
    }

    setupEventListeners() {
        const deleteButton = document.getElementById('delete-blog-btn');
        if (deleteButton) {
            deleteButton.addEventListener('click', (e) => {
                e.preventDefault();
                this.deleteBlog();
            });
        }
    }

    async deleteBlog() {
        if (!confirm('Ar tikrai norite ištrinti šią naujieną?')) {
            return;
        }

        try {
            const result = await apiService.deleteBlog(this.blogId);
            if (result.success) {
                alert('Naujiena sėkmingai ištrinta!');
                window.location.href = 'index.html';
            } else {
                alert('Klaida: ' + result.error);
            }
        } catch (error) {
            alert('Įvyko klaida: ' + error.message);
        }
    }

    showError(message) {
        document.getElementById('loading-message').style.display = 'none';
        const errorDiv = document.getElementById('error-message');
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    const blogDetailManager = new BlogDetailManager();
    await blogDetailManager.init();
});