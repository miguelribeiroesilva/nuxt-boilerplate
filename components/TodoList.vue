<script setup lang="ts">
import { ref, onMounted } from 'vue'

const { getCollection, setDocument, updateDocument, deleteDocument } = useFirestore()
const todos = ref([])
const newTodo = ref('')
const loading = ref(true)

// Fetch todos
const fetchTodos = async () => {
  loading.value = true
  try {
    todos.value = await getCollection('todos')
  } catch (error) {
    console.error('Error fetching todos:', error)
  }
  loading.value = false
}

// Add todo
const addTodo = async () => {
  if (!newTodo.value.trim()) return

  try {
    const todoData = {
      text: newTodo.value,
      completed: false,
      createdAt: new Date()
    }
    await setDocument('todos', '', todoData)
    newTodo.value = ''
    await fetchTodos()
  } catch (error) {
    console.error('Error adding todo:', error)
  }
}

// Toggle todo completion
const toggleTodo = async (todoId: string, completed: boolean) => {
  try {
    await updateDocument('todos', todoId, {
      completed: !completed
    })
    await fetchTodos()
  } catch (error) {
    console.error('Error updating todo:', error)
  }
}

// Delete todo
const deleteTodo = async (todoId: string) => {
  try {
    await deleteDocument('todos', todoId)
    await fetchTodos()
  } catch (error) {
    console.error('Error deleting todo:', error)
  }
}

onMounted(() => {
  fetchTodos()
})
</script>

<template>
  <div class="max-w-md mx-auto p-6">
    <h2 class="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Todo List</h2>

    <!-- Add todo form -->
    <form class="mb-6" @submit.prevent="addTodo">
      <div class="flex gap-2">
        <input
          v-model="newTodo"
          type="text"
          placeholder="Add a new todo..."
          class="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        >
        <button
          type="submit"
          class="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-blue-600 dark:hover:bg-blue-700"
        >
          Add
        </button>
      </div>
    </form>

    <!-- Loading state -->
    <div v-if="loading" class="text-center text-gray-600 dark:text-gray-400">
      Loading todos...
    </div>

    <!-- Todo list -->
    <ul v-else class="space-y-3">
      <li
        v-for="todo in todos"
        :key="todo.id"
        class="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800"
      >
        <div class="flex items-center gap-3">
          <input
            type="checkbox"
            :checked="todo.completed"
            class="h-5 w-5 rounded border-gray-300 text-blue-500 focus:ring-blue-500 dark:border-gray-600"
            @change="toggleTodo(todo.id, todo.completed)"
          >
          <span
            :class="{
              'text-gray-800 dark:text-white': !todo.completed,
              'text-gray-500 line-through dark:text-gray-400': todo.completed
            }"
          >
            {{ todo.text }}
          </span>
        </div>
        <button
          class="text-red-500 hover:text-red-600 focus:outline-none dark:text-red-400 dark:hover:text-red-300"
          @click="deleteTodo(todo.id)"
        >
          <Icon name="heroicons:trash" class="h-5 w-5" />
        </button>
      </li>
    </ul>

    <!-- Empty state -->
    <div
      v-if="!loading && todos.length === 0"
      class="text-center text-gray-600 dark:text-gray-400"
    >
      No todos yet. Add one above!
    </div>
  </div>
</template>
