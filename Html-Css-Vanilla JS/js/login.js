document.addEventListener('DOMContentLoaded', () => {
    const API_BASE_URL = 'http://localhost:5000';
    const loginForm = document.getElementById('loginForm');
    const errorMessage = document.getElementById('errorMessage');


    if (localStorage.getItem('authToken')) {
        window.location.href = 'main.html';
        return;
    }


    if (loginForm) {
        loginForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            errorMessage.style.display = 'none';
            errorMessage.textContent = '';

            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            try {
                const response = await fetch(`${API_BASE_URL}/auth/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, password })
                });

                const data = await response.json();
                console.log(data)
                if (!response.ok) {
                     throw new Error(data.message);
                }

                if (data.access_token) {
                    localStorage.setItem('authToken', data.access_token);
                    window.location.href = 'main.html';
                } else {
                    throw new Error(data.message);
                }

            } catch (error) {
                console.error('Login error:', error);
                errorMessage.textContent = error.message;
                errorMessage.style.display = 'block';
            }
        });
    }
});