
 const API_BASE_URL = 'http://localhost:5000';
 const token = localStorage.getItem('authToken');


 if (!token) {
     window.location.href = 'login.html';
 }

 const form = document.getElementById('createTaskForm');
 const errorMessage = document.getElementById('errorMessage');
 const successMessage = document.getElementById('successMessage');

 form.addEventListener('submit', async (event) => {
     event.preventDefault();

     errorMessage.style.display = 'none';
     errorMessage.textContent = '';
     successMessage.style.display = 'none';
     successMessage.textContent = '';

     const title = document.getElementById('title').value;
     const description = document.getElementById('description').value;
     const dueDate = document.getElementById('dueDate').value;
     const priority = document.getElementById('priority').value;

     try {
         const response = await fetch(`${API_BASE_URL}/tasks`, {
             method: 'POST',
             headers: {
                 'Content-Type': 'application/json',
                 'Authorization': `Bearer ${token}`
             },
             body: JSON.stringify({
                 title,
                 description,
                 dueDate: dueDate,
                 priority
             })
             
            });

         const data = await response.json();
            

         if (!response.ok) {
             const errorData = await response.json();
             throw new Error(errorData.message);
         }
         if(data.id){
        
            successMessage.textContent = 'Task Created 🎉';
            successMessage.style.display = 'block';
            form.reset();

            setTimeout(() => {
                window.location.href = 'main.html';
            }, 1000);

         }else{
            throw new Error(data.message);
         }


     } catch (error) {
         console.error('Error creating task:', error);
         errorMessage.textContent = `Error creating task: ${error.message}`;
         errorMessage.style.display = 'block';
     }
 });