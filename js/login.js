import { authManager } from './auth.js';

document.addEventListener('DOMContentLoaded', async function() {
    console.log('🚀 login.js loaded');
    
    // Inicializuojame auth managerį
    await authManager.init();
    
    // Jei jau prisijungęs, nukreipiame į pagrindinį puslapį
    if (authManager.isAuthenticated()) {
        console.log('👤 User already authenticated, redirecting...');
        window.location.href = 'index.html';
        return;
    }
    
    const loginForm = document.getElementById('login-form');
    const messageContainer = document.getElementById('message-container');
    
    console.log('📝 Login form found:', !!loginForm);
    
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        console.log('🔄 Login form submitted');
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        console.log('📧 Email:', email);
        
        // Show loading state
        const submitBtn = loginForm.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Prisijungiama...';
        
        try {
            console.log('🔐 Calling authManager.login...');
            const result = await authManager.login(email, password);
            console.log('✅ Login result:', result);
            
            if (result.success) {
                messageContainer.innerHTML = `<div class="success-message">${result.message}</div>`;
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1500);
            } else {
                messageContainer.innerHTML = `<div class="error-message">${result.error}</div>`;
            }
        } catch (error) {
            console.error('❌ Login error:', error);
            messageContainer.innerHTML = `<div class="error-message">Įvyko klaida: ${error.message}</div>`;
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Prisijungti';
        }
    });
});