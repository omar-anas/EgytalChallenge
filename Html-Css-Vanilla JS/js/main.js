document.addEventListener('DOMContentLoaded', () => {

    const API_BASE_URL = 'http://localhost:5000';
    const taskListDiv = document.getElementById('taskList');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const logoutButton = document.getElementById('logoutButton');
    const statusFilter = document.getElementById('statusFilter');

    const token = localStorage.getItem('authToken');

    
    if (!token) {
        window.location.href = 'login.html';
        return; 
    }

   
    const fetchTasks = async (status = '') => {
        taskListDiv.innerHTML = '<p>Loading tasks...</p>';

        let url = `${API_BASE_URL}/tasks`;
        const queryParams = [];
        if (status) {
            queryParams.push(`status=${encodeURIComponent(status)}`);
        }

        if (queryParams.length > 0) {
            url += `?${queryParams.join('&')}`;
        }

        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.status === 401) {
                 console.error('Authentication error. Redirecting to login.');
                 localStorage.removeItem('authToken');
                 window.location.href = 'login.html';
                 return;
            }

            if (!response.ok) {
                throw new Error(`error!`);
            }

            const data = await response.json();
           
            const tasks = data.tasks;
            
            renderTasks(tasks);
           


        } catch (error) {
            console.error('Error fetching tasks:', error);
            taskListDiv.innerHTML = `<p class="error-message">Error loading tasks: ${error.message}. Please try again later.</p>`;
        }
    };

   
    const renderTasks = (tasks) => {
        taskListDiv.innerHTML = '';// just to clear messages

        if (tasks.length === 0) {
            taskListDiv.innerHTML = '<p>No tasks found.</p>';
            return;
        }

        tasks.forEach(task => {
            const taskElement = document.createElement('div');
            taskElement.classList.add('task-item');
            
                taskElement.classList.add(task.status);
            
            taskElement.dataset.taskId = task.id;

        
            let formattedDueDate = 'No due date';
            if (task.dueDate) {
                try {
                    formattedDueDate = new Date(task.dueDate).toLocaleDateString();
                } catch (e) { console.error("Invalid date format:", task.dueDate); }
            }


            taskElement.innerHTML = `
                <div class="task-details">
                    <h3>${task.title}</h3>
                    <p>${task.description || 'No description'}</p>
                    <small>Due: ${formattedDueDate} | Priority: ${task.priority}</small>
                </div>
                <div class="task-actions">
                    <button class="complete-btn">${task.status ==='completed' ? 'Mark Incomplete' : 'Mark Complete'}</button>
                    <button class="delete-btn">Delete</button>
                </div>
            `;

            
            const completeBtn = taskElement.querySelector('.complete-btn');
            const deleteBtn = taskElement.querySelector('.delete-btn');

            completeBtn.addEventListener('click', () => toggleCompleteTask(task.id, task.status));
            deleteBtn.addEventListener('click', () => deleteTask(task.id));

            taskListDiv.appendChild(taskElement);
        });
    };


    const toggleCompleteTask = async (taskId, currStatus) => {
        let desiredStatus
        
        try {
            if(currStatus === 'completed'){
                desiredStatus = 'pending' 
            }else{
                desiredStatus = 'completed' 
            }

             const response = await fetch(`${API_BASE_URL}/tasks/${taskId}/status`, {
                 method: 'PATCH',
                 headers: {
                     'Content-Type': 'application/json',
                     'Authorization': `Bearer ${token}`
                 },
                 body: JSON.stringify({ status: desiredStatus })

             });

             if (!response.ok) {
                 const errorData = await response.json();
                 throw new Error(errorData.message);
             }

            
             fetchTasks(statusFilter.value);

        } catch (error) {
            console.error(`Error updating task ${taskId}:`, error);
            alert(`Failed to update task: ${error.message}`);
        }
    };

   
    const deleteTask = async (taskId) => {
         if (!confirm('Are you sure you want to delete this task?')) {
             return; 
         }

        try {
             const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
                 method: 'DELETE',
                 headers: {
                     'Authorization': `Bearer ${token}`
                 }
             });

              if (!response.ok) {
                 const errorData = await response.json().catch(() => ({})); 
                 throw new Error(errorData.message);
             }

            
              const taskElement = taskListDiv.querySelector(`.task-item[data-task-id='${taskId}']`);
              if (taskElement) {
                 taskElement.remove();
              }
              

        } catch (error) {
            console.error(`Error deleting task ${taskId}:`, error);
            alert(`Failed to delete task: ${error.message}`);
        }
    };

   
    if (addTaskBtn) {
        addTaskBtn.addEventListener('click', () => {
            window.location.href = 'create-task.html';
        });
    }

    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            localStorage.removeItem('authToken');
            window.location.href = 'login.html'; 
        });
    }

    if (statusFilter) {
        statusFilter.addEventListener('change', (event) => {
            fetchTasks(event.target.value);
        });
    }


    fetchTasks(); 



});