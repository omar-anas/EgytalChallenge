<script setup>
import { ref, watch, reactive } from 'vue';

const emit = defineEmits(['submit-task', 'cancel']); 

const taskData = reactive({
  title: '',
  description: '',
  dueDate: '',
  priority: 'medium', 
});

const errorMessage = ref('');

const handleSubmit = () => {
  errorMessage.value = '';
  if (!taskData.title) {
      errorMessage.value = 'Task title is required.';
      return;
  }

  emit('submit-task', { ...taskData });
};

const resetForm = () => {
  taskData.title = '';
  taskData.description = '';
  taskData.dueDate = '';
  taskData.priority = 'medium';
  errorMessage.value = '';
}



</script>

<template>
  <form @submit.prevent="handleSubmit" class="task-form">
    <h2>{{ 'Create New Task' }}</h2> <div class="form-group">
      <label for="title">Title:</label>
      <input type="text" id="title" v-model.trim="taskData.title" required>
    </div>

    <div class="form-group">
      <label for="description">Description:</label>
      <textarea id="description" v-model.trim="taskData.description" rows="4"></textarea>
    </div>

    <div class="form-group">
      <label for="dueDate">Due Date:</label>
      <input type="date" id="dueDate" v-model="taskData.dueDate">
    </div>

    <div class="form-group">
      <label for="priority">Priority:</label>
      <select id="priority" v-model="taskData.priority">
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
    </div>

    <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>

    <div class="form-actions">
        <button type="submit">Save Task</button>
        </div>
  </form>
</template>

<style scoped>

.task-form {
    background-color: #fff;
    padding: 2rem;
    border-radius: 5px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    max-width: 600px;
    margin: 1rem auto; /* Center form if needed */
}

.task-form h2 {
    margin-top: 0;
    margin-bottom: 1.5rem;
    text-align: center;
}

.form-group { margin-bottom: 1.5rem; }
.form-group label { display: block; margin-bottom: 0.5rem; font-weight: bold; }
.form-group input[type="text"],
.form-group input[type="date"],
.form-group textarea,
.form-group select { width: 100%; padding: 0.75rem; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box; font-size: 1rem; }
.form-group textarea { resize: vertical; }

.form-actions {
    margin-top: 1.5rem;
    text-align: right; 
   
}

.form-actions button {
    background-color: #5cb85c;
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    font-size: 1rem; /* Slightly smaller */
    cursor: pointer;
    border-radius: 4px;
   
}
.form-actions button[type="button"] { /* Style for cancel button */
    background-color: #ccc;
    color: #333;
}
.form-actions button:hover { opacity: 0.9; }
.form-actions button[type="submit"]:hover { background-color: #4cae4c; }
.form-actions button[type="button"]:hover { background-color: #bbb; }

.error-message { color: #d9534f; margin-top: 1rem; font-weight: bold; text-align: center; }

</style>