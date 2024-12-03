<script setup lang="ts">
import Button from 'primevue/button';
import BackButton from '~/components/BackButton.vue';
import HelpDialog from '~/components/HelpDialog.vue';

defineProps({
  title: {
    type: String,
    default: ''
  },
  modelName: {
    type: String,
    default: ''
  },
  modelStatus: {
    type: Boolean,
    default: false
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
      <HelpDialog :title="title" docPath="/docs/chat" />
      <div class="flex items-center gap-2">
        <div v-if="modelName" class="flex items-center">
          <span class="text-xs text-gray-500 mr-2">{{ modelName }}</span>
          <i
            v-if="modelStatus"
            class="pi pi-check text-green-500 text-xs"
            v-tooltip="'Model is working'"
          ></i>
          <i
            v-else
            class="pi pi-times text-red-500 text-xs"
            v-tooltip="'Model is not working'"
          ></i>
        </div>
        <Button
          icon="pi pi-cog"
          @click="onSettingsClick"
          text
          rounded
          aria-label="Settings"
          class="p-1"
        />
      </div>
    </div>
  </header>
</template>
