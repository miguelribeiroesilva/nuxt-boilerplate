<!-- MessagesArea.vue -->
<template>
  <div
    ref="messagesContainer"
    class="flex-1 overflow-y-auto px-4 py-2 space-y-4"
    :class="{ 'scrollbar-hide': hideScrollbar }"
  >
    <div v-for="(message, index) in messages" :key="index" class="message-wrapper">
      <div
        class="message rounded-lg p-1 max-w-[85%]"
        :class="{
          'ml-auto bg-blue-600 text-white': message.role === 'user' || message.role === 'human',
          'bg-gray-200 dark:bg-gray-700': message.role === 'assistant' || message.role === 'ai',
          'bg-yellow-100 dark:bg-yellow-900': message.role === 'error'
        }"
      >
        <div v-if="message.role === 'error'" class="text-red-500 dark:text-red-400">
          {{ message.content }}
        </div>
        <div v-else class="whitespace-pre-wrap">{{ message.content }}</div>
      </div>
    </div>
    <div v-if="isLoading" class="flex items-center space-x-2">
      <div class="typing-indicator">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Message {
  role: 'user' | 'assistant' | 'error' | 'human' | 'ai'
  content: string
}

const props = withDefaults(defineProps<{
  messages: Message[]
  isLoading?: boolean
  hideScrollbar?: boolean
}>(), {
  messages: () => [],
  isLoading: false,
  hideScrollbar: false
})

const messagesContainer = ref<HTMLElement | null>(null)

const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

onMounted(() => {
  scrollToBottom()
})

watch(() => props.messages, () => {
  nextTick(() => {
    scrollToBottom()
  })
}, { deep: true })

watch(() => props.isLoading, (newVal) => {
  if (newVal) {
    nextTick(() => {
      scrollToBottom()
    })
  }
})
</script>
