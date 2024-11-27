// Type declarations for #app module
declare module '#app' {
  import type { RuntimeConfig } from 'nuxt/schema'
  
  export function useRuntimeConfig(): RuntimeConfig
}
