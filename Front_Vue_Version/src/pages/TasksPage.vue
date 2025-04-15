<script setup>
import { ref, onMounted, watch } from 'vue';
import api from '@/api';
import TaskList from '@/components/TaskList.vue';

const tasks = ref([]);
const isLoading = ref(false);
const errorMessage = ref('');
const filterStatus = ref(''); 

const fetchTasks = async () => {
  isLoading.value = true;
  errorMessage.value = '';
  tasks.value = [];
  try {
    const params = {};
    if (filterStatus.value) {
        params.status = filterStatus.value;
    }
    
    const response = await api.getTasks(params);
    tasks.value = Array.isArray(response.data.tasks) ? response.data.tasks : [];
    
  } catch (error) {

    errorMessage.value = 'Failed to load tasks:';

  } finally {
    isLoading.value = false;
  }
};


const handleToggleComplete = async ({ id, newStatus }) => { // Expect { id, newStatus }
  const taskIndex = tasks.value.findIndex(t => t.id === id);
  try {
    await api.updateTaskStatus(id, newStatus);
     await fetchTasks();

  } catch (error) {
    alert('Failed to update task status');
  }
};

const handleDeleteTask = async (taskId) => {
    const taskIndex = tasks.value.findIndex(t => t.id === taskId);
    const removedTask = taskIndex !== -1 ? tasks.value.splice(taskIndex, 1)[0] : null;

    try {
        await api.deleteTask(taskId);
    } catch (error) {
        console.error(`Error deleting task ${taskId}:`, error);
        alert(`Failed to delete task: ${error.message}`);
        if (removedTask && taskIndex !== -1) {
            tasks.value.splice(taskIndex, 0, removedTask);
        }
    }
};


onMounted(fetchTasks);

watch(filterStatus, () => {
    fetchTasks();
});


</script>

<template>
  <div>
    <div class="page-header">
      <div class="task-controls">
          <router-link to="/tasks/new" class="btn btn-add">Add New Task</router-link>
           <select v-model="filterStatus" aria-label="Filter tasks by status">
               <option value="">All Statuses</option>
               <option value="pending">Pending</option>
               <option value="completed">Completed</option>
           </select>
       </div>
    </div>

    <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>

    <TaskList
      :tasks="tasks"
      :loading="isLoading"
      @toggle-complete="handleToggleComplete"
      @delete-task="handleDeleteTask"
    />

    </div>
</template>

<style scoped>
.page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
    flex-wrap: wrap; /* Allow wrapping */
    gap: 1rem;
}
.page-header h2 {
    margin: 0;
}

.task-controls {
    display: flex;
    gap: 1rem;
    align-items: center;
}

.task-controls select {
    padding: 0.6rem 1rem;
    font-size: 1rem;
    border-radius: 4px;
    border: 1px solid #ccc;
}
/* Basic button styling class */
.btn {
    padding: 0.6rem 1rem;
    font-size: 1rem;
    border-radius: 4px;
    border: 1px solid #ccc;
    text-decoration: none;
    cursor: pointer;
    text-align: center;
}
.btn-add {
     background-color: #5cb85c;
     color: white;
     border-color: #4cae4c;
}
.btn-add:hover {
      background-color: #4cae4c;
}

.error-message { color: #d9534f; font-weight: bold; text-align: center; margin-bottom: 1rem; }

@media (max-width: 600px) {
    .page-header {
        flex-direction: column;
        align-items: stretch; /* Make controls take full width */
    }
     .task-controls {
         flex-direction: column;
     }
      .task-controls select, .task-controls .btn {
          width: 100%;
          box-sizing: border-box;
      }
}
</style>