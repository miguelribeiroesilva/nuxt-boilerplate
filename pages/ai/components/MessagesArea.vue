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
import { defineProps } from 'vue'

interface Message {
  role: 'user' | 'assistant' | 'error' | 'human' | 'ai'
  content: string
}

const props = defineProps<{
  messages: Message[]
  isLoading?: boolean
  hideScrollbar?: boolean
}>()

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

<style scoped>
@import '~/assets/css/chats.css';

.typing-indicator {
  @apply flex space-x-1;
}

.typing-indicator span {
  @apply w-2 h-2 bg-gray-400 rounded-full;
  animation: bounce 1.4s infinite ease-in-out;
}

.typing-indicator span:nth-child(1) {
  animation-delay: -0.32s;
}

.typing-indicator span:nth-child(2) {
  animation-delay: -0.16s;
}

@keyframes bounce {
  0%, 80%, 100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1.0);
  }
}

.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
</style>
