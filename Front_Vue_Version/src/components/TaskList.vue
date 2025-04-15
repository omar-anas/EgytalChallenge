<script setup>
import TaskItem from './TaskItem.vue';


defineProps({
  tasks: {
    type: Array,
    required: true,
    default: () => [] 
  },
  loading: {
    type: Boolean,
    default: false
  }
});


const emit = defineEmits(['toggle-complete', 'delete-task']);


const handleToggleComplete = (payload) => {
  emit('toggle-complete', payload);
};

const handleDeleteTask = (taskId) => {
  emit('delete-task', taskId);
};

</script>

<template>
  <div class="task-list-container">
    <div v-if="loading">
      <p>Loading tasks...</p>
      </div>
    <div v-else-if="tasks.length === 0">
      <p>No tasks found. Add one!</p>
    </div>
    <div v-else>
      <TaskItem
        v-for="task in tasks"
        :key="task.id"
        :task="task"
        @toggle-complete="handleToggleComplete"
        @delete-task="handleDeleteTask"
      />
    </div>
    </div>
</template>

<style scoped>
.task-list-container {
  margin-top: 1rem;
}
.task-list-container p {
    text-align: center;
    color: #666;
    padding: 1rem;
}
</style>