<template>
  <Menubar
    :model="items"
    class="dark:bg-gray-900 dark:text-white bg-white text-gray-900"
  >
    <template #item="{ item, props, root }">
      <a
        v-ripple
        class="flex align-items-center text-gray-900 dark:text-white"
        v-bind="props.action"
      >
        <span
          v-if="item.icon"
          :class="[item.icon, 'mr-2 text-gray-900 dark:text-white']"
        ></span>
        <span>{{ item.label }}</span>
        <Badge v-if="item.badge" :class="{ 'ml-auto': !root, 'ml-2': root }" :value="item.badge" />
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
import Ripple from 'primevue/ripple'

const colorMode = useColorMode()

const router = useRouter()

const navigateTo = (route: string) => {
  router.push(route)
}

// Reactive items with type annotation
const items = ref<MenuItem[]>([
  {
    class: 'dark:bg-gray-900 dark:text-white bg-white text-gray-900',
    label: 'Home',
    command: () => navigateTo('/'),
    icon: 'pi pi-home'
  },
  {
    class: 'dark:bg-gray-900 dark:text-white bg-white text-gray-900',
    label: 'AI',
    icon: 'pi pi-brain',
    badge: 'New',
    items: [
      {
        class: 'dark:bg-gray-900 dark:text-white bg-white text-gray-900',
        label: 'Chat',
        icon: 'pi pi-comments',
        command: () => navigateTo('/ai/chat')
      },
      {
        class: 'dark:bg-gray-900 dark:text-white bg-white text-gray-900',
        label: 'Chat with Tools',
        icon: 'pi pi-cog',
        command: () => navigateTo('/ai/chat-tools')
      },
      {
        class: 'dark:bg-gray-900 dark:text-white bg-white text-gray-900',
        label: 'Streaming Chat',
        icon: 'pi pi-bolt',
        command: () => navigateTo('/ai/chat-stream')
      },
      {
        class: 'dark:bg-gray-900 dark:text-white bg-white text-gray-900',
        label: 'ReAct Agent',
        icon: 'pi pi-bolt',
        command: () => navigateTo('/ai/react-agent')
      },
      {
        class: 'dark:bg-gray-900 dark:text-white bg-white text-gray-900',
        label: 'Reflection Agent',
        icon: 'pi pi-bolt',
        command: () => navigateTo('/ai/reflection-agent')
      },
      {
        class: 'dark:bg-gray-900 dark:text-white bg-white text-gray-900',
        label: 'Retrieval Agent',
        icon: 'pi pi-bolt',
        command: () => navigateTo('/ai/retrieval-agent')
      },
      {
        class: 'dark:bg-gray-900 dark:text-white bg-white text-gray-900',
        label: 'Multi Agent',
        icon: 'pi pi-bolt',
        command: () => navigateTo('/ai/multi-agent')
      },
      {
        class: 'dark:bg-gray-900 dark:text-white bg-white text-gray-900',
        label: 'Agent Collaboration',
        icon: 'pi pi-cog',
        command: () => navigateTo('/ai/agent-collaboration')
      }
    ]
  },
  {
    class: 'dark:bg-gray-900 dark:text-white bg-white text-gray-900',
    label: 'Firebase',
    icon: 'pi pi-database',
    items: [
      {
        class: 'dark:bg-gray-900 dark:text-white bg-white text-gray-900',
        label: 'Firebase Setup',
        icon: 'pi pi-cog',
        command: () => navigateTo('/firebase/setup')
      },
      {
        class: 'dark:bg-gray-900 dark:text-white bg-white text-gray-900',
        label: 'Firebase Auth',
        icon: 'pi pi-user',
        command: () => navigateTo('/firebase/auth')
      },
      {
        class: 'dark:bg-gray-900 dark:text-white bg-white text-gray-900',
        label: 'Firestore',
        icon: 'pi pi-database',
        command: () => navigateTo('/firebase/firestore')
      },
      {
        class: 'dark:bg-gray-900 dark:text-white bg-white text-gray-900',
        label: 'Firebase Storage',
        icon: 'pi pi-file',
        command: () => navigateTo('/firebase/storage')
      },
      {
        class: 'dark:bg-gray-900 dark:text-white bg-white text-gray-900',
        label: 'Fake Data',
        icon: 'pi pi-code',
        command: () => navigateTo('/firebase/fakedata')
      }
    ]
  },
  {
    class: 'dark:bg-gray-900 dark:text-white bg-white text-gray-900',
    label: 'PrimeVue',
    icon: 'pi pi-prime',
    items: [
      {
        class: 'dark:bg-gray-900 dark:text-white bg-white text-gray-900',
        label: 'Button',
        icon: 'pi pi-circle',
        items: [
          {
            class: 'dark:bg-gray-900 dark:text-white bg-white text-gray-900',
            label: 'Button',
            icon: 'pi pi-circle',
            command: () => navigateTo('/primevue/button/button'),
          },
          {
            class: 'dark:bg-gray-900 dark:text-white bg-white text-gray-900',
            label: 'Speed Dial',
            icon: 'pi pi-circle',
            command: () => navigateTo('/primevue/button/speeddial'),
          },
          {
            class: 'dark:bg-gray-900 dark:text-white bg-white text-gray-900',
            label: 'Split Button',
            icon: 'pi pi-circle',
            command: () => navigateTo('/primevue/button/splitbutton'),
          }
        ]
      },
      {
        class: 'dark:bg-gray-900 dark:text-white bg-white text-gray-900',
        label: 'Chart',
        icon: 'pi pi-chart-bar',
        items: [
          {
            class: 'dark:bg-gray-900 dark:text-white bg-white text-gray-900',
            label: 'Chart.js',
            icon: 'pi pi-chart-bar',
            command: () => navigateTo('/primevue/chart/charts'),
          }
        ]
      },
      {
        class: 'dark:bg-gray-900 dark:text-white bg-white text-gray-900',
        label: 'Data',
        icon: 'pi pi-table',
        items: [
          {
            class: 'dark:bg-gray-900 dark:text-white bg-white text-gray-900',
            label: 'Data Table',
            icon: 'pi pi-table',
            command: () => navigateTo('/primevue/data/datatable'),
          },
          {
            class: 'dark:bg-gray-900 dark:text-white bg-white text-gray-900',
            label: 'Data View',
            icon: 'pi pi-th-large',
            command: () => navigateTo('/primevue/data/dataview'),
          },
          {
            class: 'dark:bg-gray-900 dark:text-white bg-white text-gray-900',
            label: 'Order List',
            icon: 'pi pi-sort',
            command: () => navigateTo('/primevue/data/orderlist'),
          },
          {
            class: 'dark:bg-gray-900 dark:text-white bg-white text-gray-900',
            label: 'Organization Chart',
            icon: 'pi pi-sitemap',
            command: () => navigateTo('/primevue/data/organizationchart'),
          },
          {
            class: 'dark:bg-gray-900 dark:text-white bg-white text-gray-900',
            label: 'Paginator',
            icon: 'pi pi-arrows-h',
            command: () => navigateTo('/primevue/data/paginator'),
          },
          {
            class: 'dark:bg-gray-900 dark:text-white bg-white text-gray-900',
            label: 'Pick List',
            icon: 'pi pi-list',
            command: () => navigateTo('/primevue/data/picklist'),
          },
          {
            class: 'dark:bg-gray-900 dark:text-white bg-white text-gray-900',
            label: 'Tree',
            icon: 'pi pi-list',
            command: () => navigateTo('/primevue/data/tree'),
          },
                    {
            class: 'dark:bg-gray-900 dark:text-white bg-white text-gray-900',
            label: 'Tabview',
            icon: 'pi pi-prime',
            command: () => navigateTo('/primevue/tabview'),
          },
          {
            class: 'dark:bg-gray-900 dark:text-white bg-white text-gray-900',
            label: 'TreeTable',
            icon: 'pi pi-table',
            command: () => navigateTo('/primevue/data/treetable'),
          },
          {
            class: 'dark:bg-gray-900 dark:text-white bg-white text-gray-900',
            label: 'Timeline',
            icon: 'pi pi-clock',
            command: () => navigateTo('/primevue/data/timeline'),
          },
          {
            class: 'dark:bg-gray-900 dark:text-white bg-white text-gray-900',
            label: 'Virtual Scroller',
            icon: 'pi pi-list',
            command: () => navigateTo('/primevue/data/virtualscroller'),
          },

        ]
      },
      {
        class: 'dark:bg-gray-900 dark:text-white bg-white text-gray-900',
        label: 'File',
        icon: 'pi pi-file',
        items: [
          {
            class: 'dark:bg-gray-900 dark:text-white bg-white text-gray-900',
            label: 'File Upload',
            icon: 'pi pi-upload',
            command: () => navigateTo('/primevue/file/upload'),
          }
        ]
      },
      {
        class: 'dark:bg-gray-900 dark:text-white bg-white text-gray-900',
        label: 'Form',
        icon: 'pi pi-pencil',
        items: []
      },
      {
        class: 'dark:bg-gray-900 dark:text-white bg-white text-gray-900',
        label: 'Media',
        icon: 'pi pi-image',
        items: []
      },
      {
        class: 'dark:bg-gray-900 dark:text-white bg-white text-gray-900',
        label: 'Menu',
        icon: 'pi pi-bars',
        items: []
      },
      {
        class: 'dark:bg-gray-900 dark:text-white bg-white text-gray-900',
        label: 'Messages',
        icon: 'pi pi-comment',
        items: []
      },
      {
        class: 'dark:bg-gray-900 dark:text-white bg-white text-gray-900',
        label: 'Misc',
        icon: 'pi pi-ellipsis-h',
        items: []
      },
      {
        class: 'dark:bg-gray-900 dark:text-white bg-white text-gray-900',
        label: 'Overlay',
        icon: 'pi pi-window-maximize',
        items: []
      },
      {
        class: 'dark:bg-gray-900 dark:text-white bg-white text-gray-900',
        label: 'Panel',
        icon: 'pi pi-tablet',
        items: []
      }
    ]
  },
  {
    class: 'dark:bg-gray-900 dark:text-white bg-white text-gray-900',
    label: 'Resources',
    icon: 'pi pi-list',
    items: [
      {
        class: 'dark:bg-gray-900 dark:text-white bg-white text-gray-900',
        label: 'Nuxt',
        icon: 'pi pi-file',
        url: 'https://nuxt.com/docs',
        target: '_blank'
      },
      {
        class: 'dark:bg-gray-900 dark:text-white bg-white text-gray-900',
        label: 'GitHub',
        icon: 'pi pi-github',
        url: 'https://github.com/miguelribeiroesilva/nuxt-boilerplate',
        target: '_blank'
      }
    ]
  },
  {
    class: 'dark:bg-gray-900 dark:text-white bg-white text-gray-900',
    label: 'Blog',
    command: () => navigateTo('/blog'),
    icon: 'pi pi-book'
  },
  {
    class: 'dark:bg-gray-900 dark:text-white bg-white text-gray-900',
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
  @apply dark:bg-gray-900 dark:text-white bg-white text-gray-900;
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

.p-menubar .p-menuitem-list {
  @apply text-gray-900 dark:text-white;
}
.p-menubar .p-menuitem-link {
  @apply text-gray-900 dark:text-white;
}
.p-menubar .p-menuitem-link .p-menuitem-icon {
  @apply text-gray-900 dark:text-white;
}
</style>
