import { authManager } from './auth.js';
import { blogManager } from './blog.js';

// Main initialization
document.addEventListener('DOMContentLoaded', async function() {
    try {
        // Initialize auth manager
        await authManager.init();

        // Load blogs on index page
        if (document.getElementById('blogs-container')) {
            await blogManager.loadBlogs();
        }
        
        // Logout button handler
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                authManager.logout();
            });
        }
        
    } catch (error) {
        console.error('❌ Error in main.js:', error);
    }
    
    // Add theme toggle button
    const themeToggle = document.createElement('button');
    themeToggle.className = 'theme-toggle';
    themeToggle.innerHTML = '🌓';
    themeToggle.setAttribute('aria-label', 'Toggle theme');
    
    themeToggle.addEventListener('click', function() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });
    
    document.body.appendChild(themeToggle);
    
    // Load saved theme
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
});