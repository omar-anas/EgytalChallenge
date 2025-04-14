document.addEventListener('DOMContentLoaded', () => {
    const API_BASE_URL = 'http://localhost:5000';
    const signupForm = document.getElementById('signupForm');
    const errorMessage = document.getElementById('errorMessage');
    const successMessage = document.getElementById('successMessage');

    if (signupForm) {
        signupForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            errorMessage.style.display = 'none';
            errorMessage.textContent = '';
            successMessage.style.display = 'none';
            successMessage.textContent = '';


            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            try {
                const response = await fetch(`${API_BASE_URL}/auth/register`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ name, email, password })
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message);
                }

                if (data.access_token) {
                    localStorage.setItem('authToken', data.access_token);
                    successMessage.textContent = 'Signup successful! Congratulations 👏';
                    successMessage.style.display = 'block';
                    signupForm.reset();
    
                    
                    setTimeout(() => {
                        window.location.href = 'main.html';
                    }, 2000);
                    
                } else {
                    throw new Error(data.message);
                }

               


            } catch (error) {
                console.error('Signup error:', error);
                errorMessage.textContent = error.message;
                errorMessage.style.display = 'block';
            }
        });
    }
});