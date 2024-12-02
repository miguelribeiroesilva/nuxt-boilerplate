<template>
  <div class="card">
    <h1 class="text-2xl font-bold mb-4">PrimeVue Accordion Showcase</h1>

    <!-- Basic Accordion -->
    <div class="mb-6">
      <h2 class="text-xl font-semibold mb-3">Basic Accordion</h2>
      <Accordion>
        <AccordionTab header="Header I">
          <p>Content for the first accordion panel.</p>
        </AccordionTab>
        <AccordionTab header="Header II">
          <p>Content for the second accordion panel.</p>
        </AccordionTab>
        <AccordionTab header="Header III">
          <p>Content for the third accordion panel.</p>
        </AccordionTab>
      </Accordion>
    </div>

    <!-- Multiple Selection Accordion -->
    <div class="mb-6">
      <h2 class="text-xl font-semibold mb-3">Multiple Selection Accordion</h2>
      <Accordion :multiple="true">
        <AccordionTab header="Section 1">
          <p>Multiple panels can be open simultaneously.</p>
        </AccordionTab>
        <AccordionTab header="Section 2">
          <p>Another panel that can be opened alongside others.</p>
        </AccordionTab>
      </Accordion>
    </div>

    <!-- Disabled Accordion Tab -->
    <div class="mb-6">
      <h2 class="text-xl font-semibold mb-3">Accordion with Disabled Tab</h2>
      <Accordion>
        <AccordionTab header="Active Section">
          <p>This section is active and accessible.</p>
        </AccordionTab>
        <AccordionTab header="Disabled Section" :disabled="true">
          <p>This section is currently disabled.</p>
        </AccordionTab>
      </Accordion>
    </div>

    <!-- Programmatic Control -->
    <div class="mb-6">
      <h2 class="text-xl font-semibold mb-3">Programmatic Accordion Control</h2>
      <Accordion v-model:activeIndex="activeIndex">
        <AccordionTab header="Dynamic Section 1">
          <p>Content for first dynamic section.</p>
        </AccordionTab>
        <AccordionTab header="Dynamic Section 2">
          <p>Content for second dynamic section.</p>
        </AccordionTab>
        <AccordionTab header="Dynamic Section 3">
          <p>Content for third dynamic section.</p>
        </AccordionTab>
      </Accordion>
      <div class="mt-4">
        <Button 
          @click="activeIndex = 1" 
          class="mr-2"
        >
          Open Second Panel
        </Button>
        <Button 
          @click="activeIndex = -1"
        >
          Close All Panels
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// Programmatic control state
const activeIndex = ref(-1)
</script>

<style scoped>
.card {
  @apply p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md;
}
</style>
