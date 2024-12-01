import { defineNuxtPlugin } from 'nuxt/app'
import type { NuxtApp } from 'nuxt/app'
import PrimeVue from 'primevue/config'
import ToastService from 'primevue/toastservice'

export default defineNuxtPlugin((nuxtApp: NuxtApp) => {
    // Ensure PrimeVue is only applied once
    if (!nuxtApp.vueApp._context.provides['primevue']) {
        nuxtApp.vueApp.use(PrimeVue, {
            ripple: true,
            inputStyle: 'filled'
        });
        nuxtApp.vueApp.use(ToastService);
    }
})
