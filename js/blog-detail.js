import { authManager } from './auth.js';
import { apiService } from './api.js';

document.addEventListener('DOMContentLoaded', async function() {
    // Inicializuojame auth managerį
    await authManager.init();
    
    const urlParams = new URLSearchParams(window.location.search);
    const blogId = urlParams.get('id');
    
    if (!blogId) {
        showError('Naujienos ID nerastas');
        return;
    }
    
    try {
        const result = await apiService.getBlog(blogId);
        
        if (result.success) {
            const blog = result.data;
            displayBlog(blog);
        } else {
            showError('Naujiena nerasta');
        }
    } catch (error) {
        showError('Nepavyko įkelti naujienos: ' + error.message);
    }
    
    function displayBlog(blog) {
        document.getElementById('loading-message').style.display = 'none';
        document.getElementById('blog-content').style.display = 'block';
        
        document.getElementById('blog-title').textContent = blog.title;
        document.getElementById('blog-title-heading').textContent = blog.title;
        document.getElementById('blog-santrauka').textContent = blog.santrauka;
        document.getElementById('blog-body-content').textContent = blog.body;
        
        const date = new Date(blog.date).toLocaleDateString('lt-LT');
        document.getElementById('blog-meta').innerHTML = `Sukurta: <time datetime="${blog.date}">${date}</time>`;
    }
    
    function showError(message) {
        document.getElementById('loading-message').style.display = 'none';
        const errorDiv = document.getElementById('error-message');
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
    }
});