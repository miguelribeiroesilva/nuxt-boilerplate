<template>
  <ChatHeader
    title="Streaming Chat"
    :model-name="modelConfig.modelName"
    :model-status="!!model"
    :on-settings-click="() => showSidebar = true"
  />

  <ChatInterface
    v-model="newMessage"
    :messages="messages"
    :is-loading="isLoading"
    @send="sendMessage"
  />

  <ApiKeyDialog
    v-if="showApiKeyDialog"
    v-model="showApiKeyDialog"
    v-model:apiKey="apiKey"
    :error="error"
    provider="openai"
    @close="showApiKeyDialog = false"
    @submit="handleApiKeySubmit"
  />

  <ModelConfigSidebar
    v-model="showSidebar"
    :model="model"
    :config="modelConfig"
    :available-models="availableModels"
    @update:config="updateConfig"
    position="right"
  />
</template>

<script setup lang="ts">
import { collection, query, orderBy, onSnapshot, updateDoc, Timestamp, serverTimestamp, addDoc } from 'firebase/firestore'
import ModelConfigSidebar from './components/ModelConfigSidebar.vue'
import ChatInterface from './components/ChatInterface.vue'
import { useAiQuotes } from '~/composables/useAiQuotes'
import { SystemMessage, HumanMessage, AIMessage } from '@langchain/core/messages'
import ApiKeyDialog from './components/ApiKeyDialog.vue'
import ChatHeader from './components/ChatHeader.vue'

interface Message {
  id?: string
  role: 'human' | 'ai' | 'system'
  content: string
  timestamp: Date | null
}

// Get Firestore instance and utils
const { firestore, formatTimestamp } = useFirebase()

// Get AI model configuration
const {
  config: modelConfig,
  model,
  showSidebar,
  initializeModel,
  updateConfig,
  availableModels,
} = useAIModel()

// Component state
const messages = ref<Message[]>([])
const newMessage = ref('')
const isLoading = ref(false)
const apiKey = ref('')
const { error, validateApiKey } = useApiKeyValidation()
const initialized = ref(false)
const apiKeys = ref({
  openai: '',
  anthropic: ''
})
const showApiKeyDialog = ref(false)
const currentStreamingContent = ref('')
const currentStreamingMessageId = ref<string | null>(null) // Track current streaming message

// Dynamic system message based on model
const systemMessage = computed(() => {
  const selectedModel = availableModels.value.find((m: { value: any }) => m.value === modelConfig.value.modelName)
  if (selectedModel) {
    if (selectedModel.provider === 'anthropic') {
      return `You are Claude ${selectedModel.label}, an AI assistant created by Anthropic. You are helpful, direct, and aim to provide accurate and nuanced responses.`
    } else {
      return `You are OpenAI ${selectedModel.label}, an AI assistant created by OpenAI. You are helpful, creative, and aim to provide accurate and engaging responses.`
    }
  }
  return 'Welcome to the chat!'
})

const { currentQuote, getRandomQuote } = useAiQuotes()

// Update the loading state to show new quotes
watch(isLoading, (newValue: any) => {
  if (newValue) {
    getRandomQuote()
  }
})

const loadStoredApiKey = () => {
  const provider = modelConfig.value.provider
  const storedKey = window?.localStorage?.getItem(`${provider}_api_key`)
  if (storedKey) {
    apiKeys.value[provider] = storedKey
    return storedKey
  }
  return null
}

const initializeChat = async () => {
  if (await validateApiKey(apiKey.value)) {
    initialized.value = true
    showApiKeyDialog.value = false
    error.value = null
    try {
      await initializeModel(apiKey.value)
      window?.localStorage?.setItem(`${modelConfig.value.provider}_api_key`, apiKey.value)
      apiKeys.value[modelConfig.value.provider] = apiKey.value
    } catch (e) {
      console.error('Error initializing model:', e)
      error.value = 'Failed to initialize model. Please check your API key.'
      showApiKeyDialog.value = true
      window.localStorage.removeItem(`${modelConfig.value.provider}_api_key`)
    }
  }
}

// Watch for model config changes
watch(() => modelConfig.value, async (newConfig: any, oldConfig: any) => {
  // Skip if configs are the same
  if (JSON.stringify(newConfig) === JSON.stringify(oldConfig)) return

  const storedKey = loadStoredApiKey()
  if (storedKey) {
    try {
      await initializeModel(storedKey)
    } catch (e) {
      console.error('Error updating model config:', e)
      error.value = 'Failed to initialize model with stored API key.'
      showApiKeyDialog.value = true
    }
  } else {
    showApiKeyDialog.value = true
  }
}, { deep: true })

// Watch for new messages and scroll
watch([messages, currentStreamingContent], () => {
  nextTick(() => {
    scrollToBottom()
  })
})

let unsubscribe: (() => void) | undefined

onMounted(async () => {
  if (!firestore) return

  const q = query(collection(firestore, 'messages'), orderBy('timestamp', 'asc'))
  unsubscribe = onSnapshot(q, (snapshot) => {
    snapshot.docChanges().forEach((change) => {
      const messageData = change.doc.data() as any
      const message: Message = {
        id: change.doc.id,
        role: messageData.role,
        content: messageData.content,
        timestamp: messageData.timestamp instanceof Timestamp
          ? formatTimestamp(messageData.timestamp)
          : null
      }

      if (change.type === 'added') {
        // Only add if it's not the currently streaming message
        if (currentStreamingMessageId.value !== change.doc.id) {
          messages.value.push(message)
        }
      } else if (change.type === 'modified') {
        // Only update if it's not the currently streaming message
        if (currentStreamingMessageId.value !== change.doc.id) {
          const index = messages.value.findIndex((m: { id: string }) => m.id === change.doc.id)
          if (index !== -1) {
            messages.value[index] = message
          }
        }
      } else if (change.type === 'removed') {
        const index = messages.value.findIndex((m: { id: string }) => m.id === change.doc.id)
        if (index !== -1) {
          messages.value.splice(index, 1)
        }
      }
    })
  })

  try {
    const storedKey = loadStoredApiKey()
    if (storedKey) {
      await initializeChat()
    } else {
      showApiKeyDialog.value = true
    }
  } catch (e) {
    console.error('Error in onMounted:', e)
    error.value = 'Failed to initialize chat.'
    showApiKeyDialog.value = true
  }
})

onUnmounted(() => {
  if (unsubscribe) {
    unsubscribe()
  }
})

const handleApiKeySubmit = async (key: string) => {
  apiKey.value = key
  await initializeChat()
}

const scrollToBottom = () => {
  window.scrollTo({
    top: document.documentElement.scrollHeight,
    behavior: 'smooth'
  })
}

const sendMessage = async () => {
  if (!newMessage.value.trim() || isLoading.value || !model.value || !firestore) return

  const messageContent = newMessage.value.trim()
  newMessage.value = '' // Clear input immediately
  currentStreamingContent.value = '' // Reset streaming content

  try {
    isLoading.value = true

    // Add user message to messages array and Firestore
    const userMessage = {
      role: 'human',
      content: messageContent,
      timestamp: serverTimestamp(),
    }

    await addDoc(collection(firestore, 'messages'), userMessage)

    // Add initial AI message to Firestore
    const aiMessageRef = await addDoc(collection(firestore, 'messages'), {
      role: 'ai',
      content: '',
      timestamp: serverTimestamp(),
    })

    // Set current streaming message ID
    currentStreamingMessageId.value = aiMessageRef.id

    // Add message to local state for immediate display
    messages.value.push({
      id: aiMessageRef.id,
      role: 'ai',
      content: '',
      timestamp: new Date().toISOString()
    })

    // Create chat history with system message
    const chatHistory = [
      new SystemMessage(systemMessage.value),
      ...messages.value
        .filter((msg: { id: string; role: string }) => msg.id !== aiMessageRef.id && msg.role !== 'system')
        .map((msg: { role: string; content: any }) => msg.role === 'human' ? new HumanMessage(msg.content) : new AIMessage(msg.content))
    ]

    // Add current message
    chatHistory.push(new HumanMessage(messageContent))

    // Get AI response
    if (model.value) {
      const stream = await model.value.stream(chatHistory)
      let accumulatedContent = ''

      try {
        for await (const chunk of stream) {
          if (chunk.content) {
            accumulatedContent += chunk.content

            // Update local state directly
            const index = messages.value.findIndex((m: { id: string }) => m.id === aiMessageRef.id)
            if (index !== -1) {
              messages.value[index].content = accumulatedContent
            }

            // Update Firestore (but don't rely on real-time updates for this message)
            await updateDoc(aiMessageRef, {
              content: accumulatedContent,
            })
          }
        }
      } catch (streamError: Error | any) {
        console.error('Streaming error:', streamError)
        error.value = `Error during streaming: ${streamError instanceof Error ? streamError.message : String(streamError)}`

        throw streamError
      } finally {
        // Clear current streaming message ID
        currentStreamingMessageId.value = null
      }
    }
  } catch (e) {
    console.error('Error:', e)
    error.value = 'Failed to send message. Please try again.'

    // Type guard to check if e is an Error object
    if (e instanceof Error) {
      if (e.message.includes('API key')) {
        error.value = 'Invalid API key. Please check your OpenAI API key.'
        showApiKeyDialog.value = true
        model.value = null
      }
    }
  } finally {
    isLoading.value = false
    currentStreamingContent.value = ''
  }
}

watch(() => messages.value.length, () => {
  nextTick(() => {
    scrollToBottom()
  })
})

watch(() => messages.value[messages.value.length - 1]?.content, () => {
  nextTick(() => {
    scrollToBottom()
  })
})

</script>
