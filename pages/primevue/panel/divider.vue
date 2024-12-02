<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-6">PrimeVue Divider Showcase</h1>

    <!-- Horizontal Dividers -->
    <div class="mb-6">
      <h2 class="text-xl font-semibold mb-3">Horizontal Dividers</h2>
      <div class="card">
        <h3 class="text-lg mb-3">Basic Horizontal Divider</h3>
        <p>Content above the divider</p>
        <Divider />
        <p>Content below the divider</p>
      </div>

      <div class="card mt-4">
        <h3 class="text-lg mb-3">Horizontal Divider with Content</h3>
        <p>Left side content</p>
        <Divider>
          <span class="text-primary font-bold">OR</span>
        </Divider>
        <p>Right side content</p>
      </div>
    </div>

    <!-- Vertical Dividers -->
    <div class="mb-6">
      <h2 class="text-xl font-semibold mb-3">Vertical Dividers</h2>
      <div class="card">
        <div class="flex items-center space-x-4">
          <div>Left Content</div>
          <Divider layout="vertical" />
          <div>Middle Content</div>
          <Divider layout="vertical" />
          <div>Right Content</div>
        </div>
      </div>
    </div>

    <!-- Divider Styles -->
    <div class="mb-6">
      <h2 class="text-xl font-semibold mb-3">Divider Styles</h2>
      <div class="card space-y-4">
        <div>
          <h3 class="text-lg mb-3">Dashed Divider</h3>
          <p>Content above</p>
          <Divider type="dashed" />
          <p>Content below</p>
        </div>

        <div>
          <h3 class="text-lg mb-3">Dotted Divider</h3>
          <p>Content above</p>
          <Divider type="dotted" />
          <p>Content below</p>
        </div>
      </div>
    </div>

    <!-- Complex Layout with Dividers -->
    <div class="mb-6">
      <h2 class="text-xl font-semibold mb-3">Complex Layout with Dividers</h2>
      <div class="card">
        <div class="grid md:grid-cols-3 gap-4">
          <div class="text-center">
            <i class="pi pi-user text-4xl mb-3 text-primary"></i>
            <h4 class="font-semibold mb-2">Profile</h4>
            <p>User information section</p>
          </div>
          <Divider layout="vertical" />
          <div class="text-center">
            <i class="pi pi-cog text-4xl mb-3 text-primary"></i>
            <h4 class="font-semibold mb-2">Settings</h4>
            <p>Application preferences</p>
          </div>
          <Divider layout="vertical" />
          <div class="text-center">
            <i class="pi pi-bell text-4xl mb-3 text-primary"></i>
            <h4 class="font-semibold mb-2">Notifications</h4>
            <p>Alerts and updates</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Responsive Dividers -->
    <div class="mb-6">
      <h2 class="text-xl font-semibold mb-3">Responsive Dividers</h2>
      <div class="card">
        <div class="flex flex-col md:flex-row items-center">
          <div class="flex-1 text-center">
            <h3 class="text-lg mb-2">Mobile View</h3>
            <p>Horizontal divider on mobile</p>
          </div>
          <Divider />
          <div class="flex-1 text-center">
            <h3 class="text-lg mb-2">Desktop View</h3>
            <p>Vertical divider on desktop</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// No additional logic needed for this demo
</script>

<style scoped>
.card {
  @apply p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md mb-4;
}
</style>
