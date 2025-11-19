import { authManager } from './auth.js';
import { apiService } from './api.js';

document.addEventListener('DOMContentLoaded', async function() {
    // Check if user is authenticated
    await authManager.init();
    
    if (!authManager.isAuthenticated()) {
        window.location.href = 'login.html';
        return;
    }
    
    const createBlogForm = document.getElementById('create-blog-form');
    const messageContainer = document.getElementById('message-container');
    
    createBlogForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const blogData = {
            title: document.getElementById('title').value,
            santrauka: document.getElementById('santrauka').value,
            body: document.getElementById('body').value
        };
        
        // Show loading state
        const submitBtn = createBlogForm.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Kuriama...';
        
        try {
            const result = await apiService.createBlog(blogData);
            
            if (result.success) {
                messageContainer.innerHTML = `<div class="success-message">Naujiena sėkmingai sukurta!</div>`;
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1500);
            } else {
                messageContainer.innerHTML = `<div class="error-message">Klaida: ${result.error}</div>`;
            }
        } catch (error) {
            messageContainer.innerHTML = `<div class="error-message">Įvyko klaida: ${error.message}</div>`;
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Sukurti naujieną';
        }
    });
});