import { apiService } from './api.js';
import { authManager } from './auth.js';

class BlogManager {
    constructor() {
        this.api = apiService;
    }

    async loadBlogs() {
        try {
            const result = await this.api.getBlogs();
            if (result.success) {
                this.displayBlogs(result.data);
            }
        } catch (error) {
            this.showError('Nepavyko įkelti naujienų: ' + error.message);
        }
    }

    displayBlogs(blogs) {
        const container = document.getElementById('blogs-container');
        const loading = document.getElementById('loading-message');
        
        if (loading) loading.style.display = 'none';
        
        if (!blogs || blogs.length === 0) {
            container.innerHTML = `
                <div class="no-blogs">
                    <p><strong>Nėra jokių naujienų.</strong></p>
                    ${authManager.isAuthenticated() ? 
                        '<a href="create-blog.html" class="create-first-blog">Sukurti pirmą naujieną</a>' : 
                        '<p>Prisijunkite norėdami kurti naujienas</p>'
                    }
                </div>
            `;
            return;
        }

        container.innerHTML = blogs.map(blog => `
            <div class="blog-card" data-blog-id="${blog._id}">
                <div class="blog-card-content">
                    <h3 class="title">
                        <a href="blog.html?id=${blog._id}" class="blog-link">
                            ${blog.title}
                        </a>
                    </h3>
                    <p class="santrauka">${blog.santrauka}</p>
                    <div class="blog-card-footer">
                        <span class="blog-date">${new Date(blog.date).toLocaleDateString('lt-LT')}</span>
                        <a href="blog.html?id=${blog._id}" class="read-more">
                            Skaityti daugiau →
                        </a>
                    </div>
                    ${this.renderBlogActions(blog)}
                </div>
            </div>
        `).join('');

        this.addEventListeners();
    }

    renderBlogActions(blog) {
        if (!authManager.isAuthenticated()) {
            return '';
        }

        // Čia galėtumėte pridėti patikrinimą ar vartotojas yra naujienos autorius
        // Kol kas rodysime mygtukus visiems prisijungusiems vartotojams
        return `
            <div class="blog-actions">
                <a href="edit-blog.html?id=${blog._id}" class="edit-button">Redaguoti</a>
                <button class="delete-button" data-blog-id="${blog._id}">Ištrinti</button>
            </div>
        `;
    }

    addEventListeners() {
        // Trinimo mygtukų event listeneriai
        const deleteButtons = document.querySelectorAll('.delete-button');
        deleteButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const blogId = button.getAttribute('data-blog-id');
                this.deleteBlog(blogId);
            });
        });
    }

    async deleteBlog(blogId) {
        if (!confirm('Ar tikrai norite ištrinti šią naujieną?')) {
            return;
        }

        try {
            const result = await this.api.deleteBlog(blogId);
            if (result.success) {
                alert('Naujiena sėkmingai ištrinta!');
                this.loadBlogs(); // Perkrauname sąrašą
            } else {
                alert('Klaida: ' + result.error);
            }
        } catch (error) {
            alert('Įvyko klaida: ' + error.message);
        }
    }

    showError(message) {
        const errorDiv = document.getElementById('error-message');
        const loading = document.getElementById('loading-message');
        
        if (loading) loading.style.display = 'none';
        if (errorDiv) {
            errorDiv.textContent = message;
            errorDiv.style.display = 'block';
        }
    }
}

// TIK VIENAS blogManager deklaravimas!
const blogManager = new BlogManager();
export { BlogManager, blogManager };