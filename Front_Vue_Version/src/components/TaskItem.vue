<script setup>
import { computed } from 'vue'

const props = defineProps({
  task: {
    type: Object,
    required: true,
    validator: (value) => {
      return (
        typeof value.id !== 'undefined' &&
        typeof value.title === 'string' &&
        typeof value.status === 'string'
      )
    },
  },
})

const emit = defineEmits(['toggle-complete', 'delete-task'])

const formattedDueDate = computed(() => {
  const dateValue = props.task.dueDate
  if (!dateValue) return 'No due date'
  try {
    return new Date(dateValue).toLocaleDateString()
  } catch (e) {
    console.error('Invalid date format:', dateValue)
    return 'Invalid date'
  }
})

const toggleComplete = () => {
  const desiredStatus = props.task.status === 'completed' ? 'pending' : 'completed'

  emit('toggle-complete', { id: props.task.id, newStatus: desiredStatus })
}

const deleteTask = () => {
  if (confirm('Are you sure you want to delete this task?')) {
    emit('delete-task', props.task.id)
  }
}
</script>

<template>
  <div class="task-item" :class="{ completed: task.status == 'completed' }">
    <div class="task-details">
      <h3>{{ task.title }}</h3>
      <p>{{ task.description || 'No description' }}</p>
      <small>Due: {{ formattedDueDate }} | Priority: {{ task.priority }}</small>
    </div>
    <div class="task-actions">
      <button @click="toggleComplete" class="complete-btn">
        {{ task.status === 'completed' ? 'Mark Incomplete' : 'Mark Complete' }}
      </button>
      <button @click="deleteTask" class="delete-btn">Delete</button>
    </div>
  </div>
</template>

<style scoped>
.task-item {
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-bottom: 1rem;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  transition: background-color 0.3s ease;
}

.task-item.completed {
  background-color: #e9f5e9;
  border-left: 5px solid #5cb85c;
}

.task-item.completed h3 {
  text-decoration: line-through;
  color: #777;
}

.task-details {
  flex-grow: 1;
}
.task-details h3 {
  margin-top: 0;
  margin-bottom: 0.5rem;
  font-size: 1.2rem;
}
.task-details p {
  margin: 0 0 0.5rem 0;
  color: #555;
  word-break: break-word;
}
.task-details small {
  color: #777;
  font-size: 0.9em;
}

.task-actions {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex-shrink: 0;
}
.task-actions button {
  padding: 0.4rem 0.8rem;
  font-size: 0.9rem;
  cursor: pointer;
  border-radius: 3px;
  border: 1px solid #ccc;
  min-width: 100px;
  text-align: center;
}

.complete-btn {
  background-color: #337ab7;
  color: white;
  border-color: #2e6da4;
}
.complete-btn:hover {
  background-color: #286090;
}

.task-item.completed .complete-btn {
  background-color: #f0ad4e;
  border-color: #eea236;
}
.task-item.completed .complete-btn:hover {
  background-color: #ec971f;
}

.delete-btn {
  background-color: #d9534f;
  color: white;
  border-color: #d43f3a;
}
.delete-btn:hover {
  background-color: #c9302c;
}

@media (max-width: 600px) {
  .task-item {
    flex-direction: column;
    align-items: stretch;
  }
  .task-actions {
    flex-direction: row;
    justify-content: space-evenly;
    margin-top: 1rem;
    width: 100%;
  }
  .task-actions button {
    flex-grow: 1;
    margin: 0 0.2rem;
  }
}
</style>
