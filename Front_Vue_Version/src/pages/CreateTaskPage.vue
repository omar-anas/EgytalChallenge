<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import api from '@/api';
import TaskForm from '@/components/TaskForm.vue';

const router = useRouter();
const submissionError = ref('');
const isSubmitting = ref(false);

const handleCreateTask = async (taskData) => {
  submissionError.value = '';
  isSubmitting.value = true;
  try {
    await api.createTask(taskData);
    router.push('/');
  } catch (error) {
    console.error('Error creating task:', error);
    submissionError.value = `Failed to create task: ${error.response?.data?.message || error.message}`;
  } finally {
      isSubmitting.value = false;
  }
};
</script>

<template>
  <div>
    <TaskForm @submit-task="handleCreateTask" />
    <p v-if="submissionError" class="error-message">{{ submissionError }}</p>
    <p v-if="isSubmitting">Creating task...</p>
  </div>
</template>

<style scoped>
.error-message {
    color: #d9534f;
    text-align: center;
    margin-top: 1rem;
    font-weight: bold;
}
</style>