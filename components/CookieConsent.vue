<template>
  <ClientOnly>
    <div>
      <CookieControl>
        <template #default="{ isConsentGiven, moduleOptions, cookies, acceptAll, declineAll, openModal }">
          <!-- Cookie Banner -->
          <div v-if="!isConsentGiven" class="fixed bottom-0 left-0 right-0 z-50">
            <!-- Main Banner -->
            <div class="bg-white dark:bg-gray-800 shadow-lg border-t border-gray-200 dark:border-gray-700">
              <div class="container mx-auto px-4 py-6">
                <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div class="flex-1">
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {{ $t('cookie.title') }}
                    </h3>
                    <p class="text-gray-600 dark:text-gray-300 text-sm">
                      {{ $t('cookie.message') }}
                    </p>
                  </div>
                  <div class="flex flex-col sm:flex-row gap-3 min-w-[200px]">
                    <button
                      @click="openModal"
                      class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-transparent border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      {{ $t('cookie.customize') }}
                    </button>
                    <button
                      @click="acceptAll"
                      class="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors"
                    >
                      {{ $t('cookie.acceptAll') }}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Cookie Modal -->
          <Teleport to="body">
            <div v-if="moduleOptions.isModalForced" class="fixed inset-0 z-50 overflow-y-auto">
              <div class="flex min-h-screen items-center justify-center p-4">
                <!-- Backdrop -->
                <div class="fixed inset-0 bg-black/50"></div>

                <!-- Modal Content -->
                <div class="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full">
                  <!-- Header -->
                  <div class="border-b border-gray-200 dark:border-gray-700 p-4">
                    <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
                      {{ $t('cookie.preferences') }}
                    </h2>
                  </div>

                  <!-- Body -->
                  <div class="p-6">
                    <p class="text-gray-600 dark:text-gray-300 mb-6">
                      {{ $t('cookie.modalMessage') }}
                    </p>

                    <!-- Cookie Categories -->
                    <div class="space-y-6">
                      <div v-for="cookie in cookies" :key="cookie.id" class="space-y-4">
                        <div class="flex items-center justify-between">
                          <div>
                            <h3 class="text-lg font-medium text-gray-900 dark:text-white">
                              {{ cookie.name[$i18n.locale] }}
                            </h3>
                            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                              {{ cookie.description[$i18n.locale] }}
                            </p>
                          </div>
                          <label class="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              :checked="cookie.isEnabled"
                              :disabled="cookie.necessary"
                              class="sr-only peer"
                              @change="cookie.toggleEnabled()"
                            >
                            <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Footer -->
                  <div class="border-t border-gray-200 dark:border-gray-700 p-4 flex justify-end space-x-4">
                    <button
                      @click="declineAll"
                      class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-transparent border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      {{ $t('cookie.declineAll') }}
                    </button>
                    <button
                      @click="acceptAll"
                      class="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors"
                    >
                      {{ $t('cookie.acceptAll') }}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Teleport>
        </template>
      </CookieControl>
    </div>
  </ClientOnly>
</template>

<script setup lang="ts">
// Component wraps CookieControl in a ClientOnly component to ensure client-side only rendering
</script>

<style scoped>
.bg-primary-600 {
  @apply bg-blue-600;
}
.hover\:bg-primary-700:hover {
  @apply bg-blue-700;
}
.peer-focus\:ring-primary-300 {
  @apply ring-blue-300;
}
.dark\:peer-focus\:ring-primary-800 {
  @apply dark:ring-blue-800;
}
.peer-checked\:bg-primary-600 {
  @apply bg-blue-600;
}
</style>
