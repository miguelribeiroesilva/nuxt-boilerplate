// https://nuxt.com/docs/api/configuration/nuxt-config
import { defineNuxtConfig } from "nuxt/config";
import { fileURLToPath } from 'url';

interface CustomCookie {
  id: string;
  name: {
    en: string;
    fr: string;
    ar: string;
  };
  description: {
    en: string;
    fr: string;
    ar: string;
  };
  isPreselected?: boolean;
}

// Define an interface for your locale structure
interface LocaleMessages {
  locale: {
    dir: string;
  };
  site: {
    name: string;
  };
  pages: {
    index: {
      meta: {
        title: string;
        description: string;
      };
      link: string;
    };
  };
}

interface Locale {
  code: string;
  file: string;
  name?: string;
  language?: string;
}

interface CookieControlLocale {
  code: string
  barTitle: string
  barDescription: string
  acceptAll: string
  declineAll: string
  manageCookies: string
  unsaved: string
  close: string
  save: string
  necessary: {
    title: string
    description: string
  }
  optional: {
    title: string
    description: string
  }
}

export default defineNuxtConfig({
  devtools: { enabled: true },

  build: {
    transpile: ['primevue']
  },

  css: [
    'primevue/resources/themes/lara-light-blue/theme.css',
    'primevue/resources/primevue.css',
    'primeicons/primeicons.css',
    './assets/css/tailwind.css',
    './assets/css/scrollbar.css'
  ],

  runtimeConfig: {
    public: {
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL,
      anthropicApiKey: process.env.ANTHROPIC_API_KEY,
      firebaseApiKey: process.env.FIREBASE_API_KEY,
      firebaseAuthDomain: process.env.FIREBASE_AUTH_DOMAIN,
      firebaseProjectId: process.env.FIREBASE_PROJECT_ID,
      firebaseStorageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      firebaseMessagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
      firebaseAppId: process.env.FIREBASE_APP_ID,
      locales: [
        { 
          code: "en",
          name: "English",
          file: "en-US.json",
          iso: "en-US",
          language: "en"
        },
        { 
          code: "fr",
          name: "Français",
          file: "fr-FR.json",
          iso: "fr-FR",
          language: "fr"
        },
        { 
          code: "ar",
          name: "العربية",
          file: "ar-AR.json",
          iso: "ar-SA",
          language: "ar"
        }
      ]
    }
  },

  nitro: {
    preset: 'firebase',
  },

  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/color-mode',
    ['@nuxtjs/i18n', {
      baseUrl: process.env.NUXT_PUBLIC_SITE_URL,
      defaultLocale: 'en',
      strategy: 'prefix_except_default',
      langDir: "locales/",
      vueI18n: './i18n.config.ts',
      locales: [
        { 
          code: "en",
          name: "English",
          file: "en-US.json",
          iso: "en-US",
          language: "en"
        },
        { 
          code: "fr",
          name: "Français",
          file: "fr-FR.json",
          iso: "fr-FR",
          language: "fr"
        },
        { 
          code: "ar",
          name: "العربية",
          file: "ar-AR.json",
          iso: "ar-SA",
          language: "ar"
        }
      ]
    }],
    '@pinia/nuxt',
    '@nuxt/content',
    '@nuxt/image',
    '@nuxtjs/device',
    '@nuxtjs/google-fonts',
    '@dargmuesli/nuxt-cookie-control',
    'nuxt-icon'
  ],

  cookieControl: {
    locales: ['en', 'fr', 'ar']
  },

  colorMode: {
    classSuffix: '',
  },

  content: {
    // https://content.nuxtjs.org/api/configuration
    highlight: {
      theme: 'github-dark',
      preload: ['json', 'js', 'ts', 'html', 'css', 'vue', 'diff', 'shell', 'markdown', 'yaml', 'bash', 'ini']
    }
  },

  googleFonts: {
    families: {
      Inter: true
    }
  },

  image: {
    // Options
  },

  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
    }
  },

  compatibilityDate: '2024-11-24'
});