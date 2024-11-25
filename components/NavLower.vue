<template>
  <div class="card">
    <Menubar
      :model="items"
      class="bg-transparent border-none"
    </Menubar>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

const navigateTo = (route: string) => {
  router.push(route);
};

const items = [
  {
    label: 'Home',
    command: () => navigateTo('/'),
    icon: 'pi pi-home'
  },
  {
    label: 'About',
    command: () => navigateTo('/about'),
    icon: 'pi pi-info-circle'
  },
  {
    label: 'Blog',
    command: () => navigateTo('/blog'),
    icon: 'pi pi-book'
  },
  {
    label: 'AI',
    icon: 'pi pi-brain',
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
      }
    ]
  },
  {
    label: 'Features',
    icon: 'pi pi-star',
    items: [
      {
        label: 'Minimal',
        command: () => navigateTo('/minimal'),
        icon: 'pi pi-minus'
      },
      {
        label: '404',
        command: () => navigateTo('/404'),
        icon: 'pi pi-exclamation-triangle'
      }
    ]
  },
  {
    label: 'Resources',
    icon: 'pi pi-list',
    items: [
      {
        label: 'PrimeVue',
        icon: 'pi pi-prime',
        items: [
          {
            label: 'Tree',
            icon: 'pi pi-sitemap',
            command: () => navigateTo('/primevue/tree')
          }
        ]
      },
      {
        label: 'Documentation',
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
  }
];
</script>

<style scoped>
:deep(.p-menubar) {
  background: transparent;
  border: none;
  padding: 0.5rem 0;
}

:deep(.p-menubar-root-list) {
  gap: 0.5rem;
}

:deep(.p-menuitem-link) {
  border-radius: 0.5rem;
  padding: 0.75rem 1rem;
}

:deep(.p-menuitem-text) {
  color: var(--text-color);
}

:deep(.p-menuitem-icon) {
  color: var(--text-color);
}

:deep(.p-submenu-list) {
  background: var(--surface-overlay);
  border-radius: 0.5rem;
  padding: 0.5rem;
}

/* Dark mode adjustments */
.dark :deep(.p-menuitem-link:not(.p-disabled):hover) {
  background: rgba(255, 255, 255, 0.1);
}

.dark :deep(.p-menuitem-link) {
  color: white;
}

.dark :deep(.p-submenu-list) {
  background: var(--surface-overlay);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

/* Active link styles */
:deep(.router-link-active) {
  background: var(--primary-color);
}

:deep(.router-link-active .p-menuitem-text),
:deep(.router-link-active .p-menuitem-icon) {
  color: white;
}

/* Hover effect for menu items */
:deep(.p-menuitem-link:not(.p-disabled):hover) {
  background: rgba(0, 0, 0, 0.04);
}

/* Ensure text is visible in all states */
:deep(.p-menuitem-text),
:deep(.p-menuitem-icon) {
  color: inherit;
}
</style>
