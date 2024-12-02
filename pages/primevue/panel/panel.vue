<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-6">PrimeVue Panel Showcase</h1>

    <!-- Basic Panel -->
    <div class="mb-6">
      <h2 class="text-xl font-semibold mb-3">Basic Panel</h2>
      <Panel header="Basic Panel">
        <p>This is a simple panel with default styling and a header.</p>
        <p>Panels are great for organizing and presenting content in a clean, structured manner.</p>
      </Panel>
    </div>

    <!-- Toggleable Panel -->
    <div class="mb-6">
      <h2 class="text-xl font-semibold mb-3">Toggleable Panel</h2>
      <Panel header="Toggleable Panel" :toggleable="true">
        <div class="space-y-3">
          <p>This panel can be expanded and collapsed.</p>
          <Button label="Action" icon="pi pi-check" />
        </div>
      </Panel>
    </div>

    <!-- Panel with Custom Icons -->
    <div class="mb-6">
      <h2 class="text-xl font-semibold mb-3">Panel with Custom Icons</h2>
      <Panel 
        header="Custom Icon Panel" 
        :toggleable="true"
        toggleIcon="pi pi-plus"
        collapseIcon="pi pi-minus"
      >
        <div class="space-y-3">
          <p>Panel with custom toggle icons.</p>
          <div class="flex space-x-2">
            <Button label="Edit" icon="pi pi-pencil" severity="secondary" />
            <Button label="Delete" icon="pi pi-trash" severity="danger" />
          </div>
        </div>
      </Panel>
    </div>

    <!-- Panels with Complex Content -->
    <div class="mb-6">
      <h2 class="text-xl font-semibold mb-3">Panels with Complex Content</h2>
      <div class="grid md:grid-cols-2 gap-4">
        <Panel header="User Profile">
          <div class="flex items-center space-x-4">
            <Avatar 
              image="https://picsum.photos/200/200?random=1" 
              size="large" 
              shape="circle" 
            />
            <div>
              <h3 class="text-lg font-semibold">John Doe</h3>
              <p class="text-gray-500">Senior Developer</p>
            </div>
          </div>
          <Divider />
          <div class="space-y-2">
            <p><i class="pi pi-envelope mr-2 text-primary"></i>john.doe@example.com</p>
            <p><i class="pi pi-phone mr-2 text-primary"></i>+1 (555) 123-4567</p>
          </div>
        </Panel>

        <Panel header="Project Details" :toggleable="true">
          <div class="space-y-3">
            <div class="flex justify-between">
              <span>Project Progress</span>
              <ProgressBar :value="75" class="w-48" />
            </div>
            <div class="grid grid-cols-2 gap-2">
              <div>
                <h4 class="font-semibold">Timeline</h4>
                <p>Start: Jan 1, 2023</p>
                <p>End: Dec 31, 2023</p>
              </div>
              <div>
                <h4 class="font-semibold">Team</h4>
                <AvatarGroup>
                  <Avatar 
                    image="https://picsum.photos/200/200?random=2" 
                    size="small" 
                    shape="circle" 
                  />
                  <Avatar 
                    image="https://picsum.photos/200/200?random=3" 
                    size="small" 
                    shape="circle" 
                  />
                  <Avatar 
                    image="https://picsum.photos/200/200?random=4" 
                    size="small" 
                    shape="circle" 
                  />
                </AvatarGroup>
              </div>
            </div>
          </div>
        </Panel>
      </div>
    </div>

    <!-- Multiple Panels -->
    <div class="mb-6">
      <h2 class="text-xl font-semibold mb-3">Multiple Panels</h2>
      <div class="grid md:grid-cols-3 gap-4">
        <Panel header="Personal">
          <div class="text-center">
            <i class="pi pi-user text-primary text-4xl mb-3"></i>
            <p>Personal information management</p>
          </div>
        </Panel>
        <Panel header="Security">
          <div class="text-center">
            <i class="pi pi-lock text-primary text-4xl mb-3"></i>
            <p>Account security settings</p>
          </div>
        </Panel>
        <Panel header="Preferences">
          <div class="text-center">
            <i class="pi pi-cog text-primary text-4xl mb-3"></i>
            <p>User preferences and customization</p>
          </div>
        </Panel>
      </div>
    </div>

    <!-- Panel with Footer -->
    <div class="mb-6">
      <h2 class="text-xl font-semibold mb-3">Panel with Footer</h2>
      <Panel header="Footer Panel">
        <template #content>
          <p>This panel demonstrates content with a footer section.</p>
        </template>
        <template #footer>
          <div class="flex justify-end space-x-2">
            <Button label="Cancel" severity="secondary" />
            <Button label="Save" />
          </div>
        </template>
      </Panel>
    </div>
  </div>
</template>

<script setup lang="ts">
// No additional logic needed for this demo
</script>

<style scoped>
.card {
  @apply shadow-md rounded-lg p-4 mb-4;
}
</style>
