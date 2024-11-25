import type { LocaleObject } from '@nuxtjs/i18n'
import { defineI18nConfig } from '#imports'

export default defineI18nConfig(() => ({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  messages: {}
}))
