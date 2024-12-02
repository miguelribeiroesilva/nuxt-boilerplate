<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-6">PrimeVue Card Showcase</h1>

    <!-- Basic Card -->
    <div class="mb-6">
      <h2 class="text-xl font-semibold mb-3">Basic Card</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <template #title>Basic Card Title</template>
          <template #content>
            <p>This is a simple card with basic content.</p>
          </template>
        </Card>
      </div>
    </div>

    <!-- Card with Header and Footer -->
    <div class="mb-6">
      <h2 class="text-xl font-semibold mb-3">Card with Header and Footer</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <template #header>
            <img 
              alt="Card header" 
              src="https://picsum.photos/300/200?random=1" 
              class="w-full"
            />
          </template>
          <template #title>Product Card</template>
          <template #content>
            <p>A detailed description of the product goes here.</p>
          </template>
          <template #footer>
            <div class="flex justify-between">
              <Button label="Details" icon="pi pi-info" />
              <Button 
                label="Buy" 
                icon="pi pi-shopping-cart" 
                severity="success" 
              />
            </div>
          </template>
        </Card>
      </div>
    </div>

    <!-- Advanced Card with Multiple Elements -->
    <div class="mb-6">
      <h2 class="text-xl font-semibold mb-3">Advanced Card with Multiple Elements</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <template #header>
            <img 
              alt="User header" 
              src="https://picsum.photos/300/200?random=2" 
              class="w-full"
            />
          </template>
          <template #title>
            <div class="flex items-center">
              <i class="pi pi-user mr-2"></i>
              User Profile
            </div>
          </template>
          <template #content>
            <div class="space-y-2">
              <div class="flex items-center">
                <i class="pi pi-envelope mr-2"></i>
                john.doe@example.com
              </div>
              <div class="flex items-center">
                <i class="pi pi-phone mr-2"></i>
                +1 (555) 123-4567
              </div>
            </div>
          </template>
          <template #footer>
            <div class="flex justify-between">
              <Button 
                label="Edit" 
                icon="pi pi-pencil" 
                severity="secondary" 
              />
              <Button 
                label="Contact" 
                icon="pi pi-send" 
                severity="info" 
              />
            </div>
          </template>
        </Card>
      </div>
    </div>

    <!-- Responsive Card Grid -->
    <div class="mb-6">
      <h2 class="text-xl font-semibold mb-3">Responsive Card Grid</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card v-for="n in 6" :key="n">
          <template #title>Card {{ n }}</template>
          <template #content>
            <p>Responsive card layout with multiple cards.</p>
          </template>
          <template #footer>
            <Button 
              :label="`Action ${n}`" 
              :icon="`pi pi-${['heart', 'star', 'globe', 'bell', 'lock', 'calendar'][n-1]}`" 
            />
          </template>
        </Card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// No additional logic needed for this demo
</script>

<style scoped>
.card {
  @apply shadow-md rounded-lg;
}
</style>
