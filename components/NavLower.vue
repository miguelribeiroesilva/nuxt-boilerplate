<template>
  <Menubar
    :model="items"
    class="dark:bg-gray-900 dark:text-white bg-white text-gray-900"
  >
    <template #item="{ item, props, root }">
      <a v-ripple class="flex align-items-center dark:bg-gray-900 dark:text-white bg-white text-gray-900" v-bind="props.action">
        <span :class="item.icon"></span>
        <span class="ml-2  dark:bg-gray-900 dark:text-white bg-white text-gray-900">{{ item.label }}</span>
        <Badge
          v-if="item.badge"
          :class="{ 'ml-auto': !root, 'ml-2': root }"
          :value="item.badge"
        />
      </a>
    </template>
  </Menubar>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import type { MenuItem } from 'primevue/menuitem'
import Badge from 'primevue/badge'
import Menubar from 'primevue/menubar'


const colorMode = useColorMode()

const router = useRouter()

const navigateTo = (route: string) => {
  router.push(route)
}

// Computed property for dynamic classes with SSR-safe approach
// const menubarClasses = computed(() => {
//   // Use a non-reactive check to prevent SSR hydration issues
//   if (import.meta.server) return {}
//   return {
//     'dark:bg-gray-900 dark:text-white': colorMode.preference === 'dark',
//     'bg-white text-gray-900': colorMode.preference === 'light'
//   }
// })

// Reactive items with type annotation
const items = ref<MenuItem[]>([
  {
    label: 'Home',
    command: () => navigateTo('/'),
    icon: 'pi pi-home'
  },
  {
    label: 'AI',
    icon: 'pi pi-brain',
    badge: 'New',
    items: [
      {
        label: 'Chat',
        icon: 'pi pi-comments',
        command: () => navigateTo('/ai/chat')
      },
      {
        label: 'Chat with Tools',
        icon: 'pi pi-cog',
        command: () => navigateTo('/ai/chat-tools')
      },
      {
        label: 'Streaming Chat',
        icon: 'pi pi-bolt',
        command: () => navigateTo('/ai/chat-stream')
      },
      {
        label: 'ReAct Agent',
        icon: 'pi pi-bolt',
        command: () => navigateTo('/ai/react-agent')
      },
      {
        label: 'Reflection Agent',
        icon: 'pi pi-bolt',
        command: () => navigateTo('/ai/reflection-agent')
      },
      {
        label: 'Retrieval Agent',
        icon: 'pi pi-bolt',
        command: () => navigateTo('/ai/retrieval-agent')
      },
      {
        label: 'Multi Agent',
        icon: 'pi pi-bolt',
        command: () => navigateTo('/ai/multi-agent')
      },
      {
        label: 'Agent Collaboration',
        icon: 'pi pi-cog',
        command: () => navigateTo('/ai/agent-collaboration')
      }
    ]
  },
  {
    label: 'Firebase',
    icon: 'pi pi-database',
    items: [
      {
        label: 'Firebase Setup',
        icon: 'pi pi-cog',
        command: () => navigateTo('/firebase/setup')
      },
      {
        label: 'Firebase Auth',
        icon: 'pi pi-user',
        command: () => navigateTo('/firebase/auth')
      },
      {
        label: 'Firestore',
        icon: 'pi pi-database',
        command: () => navigateTo('/firebase/firestore')
      },
      {
        label: 'Firebase Storage',
        icon: 'pi pi-file',
        command: () => navigateTo('/firebase/storage')
      },
      {
        label: 'Fake Data',
        icon: 'pi pi-code',
        command: () => navigateTo('/firebase/fakedata')
      }
    ]
  },
  {
    label: 'PrimeVue',
    icon: 'pi pi-prime',
    items: [

      {
        label: 'Upload',
        icon: 'pi pi-prime',
        command: () => navigateTo('/primevue/upload'),
      },
    ]
  },
  {
    label: 'Resources',
    icon: 'pi pi-list',
    items: [

      {
        label: 'Nuxt',
        icon: 'pi pi-file',
        url: 'https://nuxt.com/docs',
        target: '_blank'
      },
      {
        label: 'GitHub',
        icon: 'pi pi-github',
        url: 'https://github.com/miguelribeiroesilva/nuxt-boilerplate',
        target: '_blank'
      }
    ]
  },

  {
    label: 'Blog',
    command: () => navigateTo('/blog'),
    icon: 'pi pi-book'
  },
  {
    label: 'About',
    command: () => navigateTo('/about'),
    icon: 'pi pi-info-circle'
  },
])

// Optional: Client-side color mode logging
onMounted(() => {
  if (process.client) {
    console.log('Current color mode:', colorMode.preference)
  }
})
</script>

<style scoped>
:deep(.p-menubar) {
  border: none;
  border-radius: 0;
  background: var(--surface-card);
  border-bottom: 1px solid var(--surface-border);
}

:deep(.p-menubar-root-list) {
  background: var(--surface-card);
}

:deep(.p-menuitem-link) {
  color: var(--text-color);
}

:deep(.p-menuitem-text) {
  color: var(--text-color);
}

:deep(.p-menuitem-icon) {
  color: var(--text-color-secondary);
}

:deep(.p-submenu-list) {
  background: var(--surface-overlay);
  border: 1px solid var(--surface-border);
}

:deep(.p-menuitem-link:hover) {
  background: var(--surface-hover);
}

:deep(.p-menuitem-link:focus) {
  box-shadow: inset 0 0 0 0.15rem var(--primary-color);
}

:deep(.p-menuitem-link) {
  padding-top: 0.25rem !important;
  padding-right: 0.5rem !important;
  padding-bottom: 0.25rem !important;
  padding-left: 0.5rem !important;
}
</style>
