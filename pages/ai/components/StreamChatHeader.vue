<script setup lang="ts">
import Button from 'primevue/button';
import BackButton from '~/components/BackButton.vue';
import HelpDialog from '~/components/HelpDialog.vue';

defineProps({
  title: {
    type: String,
    default: 'Streaming Chat'
  },
  onSettingsClick: {
    type: Function,
    required: true
  }
})
</script>

<template>
  <header>
    <div class="flex items-center gap-2 w-full px-0">
      <BackButton />
      <Button :label="title" severity="info" disabled class="flex-1" />
      <HelpDialog :title="title" docPath="/docs/chat-stream" />
      <Button
        icon="pi pi-cog"
        @click="onSettingsClick"
        text
        rounded
        aria-label="Settings"
        class="p-1"
      />
    </div>
  </header>
</template>
