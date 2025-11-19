import { authManager } from './auth.js';

document.addEventListener('DOMContentLoaded', async function() {
    // Inicializuojame auth managerį
    await authManager.init();
    
    // Jei jau prisijungęs, nukreipiame į pagrindinį puslapį
    if (authManager.isAuthenticated()) {
        window.location.href = 'index.html';
        return;
    }
    
    const registerForm = document.getElementById('register-form');
    const messageContainer = document.getElementById('message-container');
    
    registerForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = {
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            email: document.getElementById('email').value,
            password: document.getElementById('password').value
        };
        
        // Show loading state
        const submitBtn = registerForm.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Registruojama...';
        
        try {
            const result = await authManager.register(formData);
            
            if (result.success) {
                messageContainer.innerHTML = `<div class="success-message">${result.message}</div>`;
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1500);
            } else {
                messageContainer.innerHTML = `<div class="error-message">${result.error}</div>`;
            }
        } catch (error) {
            messageContainer.innerHTML = `<div class="error-message">Įvyko klaida: ${error.message}</div>`;
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Registruotis';
        }
    });
});