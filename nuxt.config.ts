// https://nuxt.com/docs/api/configuration/nuxt-config
import { defineNuxtConfig } from "nuxt/config";

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

export default defineNuxtConfig({
  devtools: { enabled: true },

  build: {
    transpile: ['primevue']
  },

  css: [
    'primevue/resources/themes/lara-light-green/theme.css',
    'primevue/resources/themes/lara-dark-green/theme.css',
    'primevue/resources/primevue.css',
    'primeicons/primeicons.css',
    './assets/css/tailwind.css',

  ],

  imports: {
    dirs: [
      // scan all modules within `./composables`
      'composables',
      // scan all modules within `./utils`
      'utils'
    ],
    global: true,
    autoImport: true
  },

  components: [
    {
      path: '~/components',
      extensions: ['.vue'],
    },
    {
      path: '~/components/global',
      global: true,
      extensions: ['.vue']
    },
    {
      path: '~/pages/ai/components',
      global: true,
      extensions: ['.vue']
    }
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
        { code: 'en', name: 'English' },
        { code: 'fr', name: 'Français' },
        { code: 'ar', name: 'العربية' }
      ]
    }
  },

  nitro: {
    preset: 'firebase',
  },

  modules: [
    '@nuxtjs/tailwindcss',
    'nuxt-icon',
    '@pinia/nuxt',
    '@nuxtjs/color-mode',
    '@nuxtjs/i18n',
    '@dargmuesli/nuxt-cookie-control',
    '@nuxt/image',
    '@nuxt/content',
    '@nuxtjs/device',
    '@nuxtjs/google-fonts',
    'nuxt-primevue',
    '@dargmuesli/nuxt-cookie-control',
  ],

  primevue: {
    cssLayerOrder: 'tailwind-base, primevue, tailwind-utilities',
    options: {
      ripple: true,
      inputStyle: 'filled'
    },
    services: {
      tooltip: true,
      ripple: true,
      confirmation: true,
      dialog: true,
      toast: true
    },
    components: {
      include: [
        'Button',
        'Calendar',
        'Checkbox',
        'Column',
        'ConfirmDialog',
        'DataTable',
        'Dialog',
        'Dropdown',
        'InputText',
        'InputNumber',
        'Menubar',
        'ProgressBar',
        'ProgressSpinner',
        'Sidebar',
        'Slider',
        'Tag',
        'Textarea',
        'Toast',
        'Tree',
        'FileUpload',
        'Menu'
      ]
    },
    directives: {
      include: ['tooltip', 'ripple']
    },
    composables: {
      include: ['useToast', 'useConfirm']
    }
  },

  i18n: {
    vueI18n: "./i18n.config.ts",
    baseUrl: process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    detectBrowserLanguage: {
      useCookie: false,
      alwaysRedirect: true,
      fallbackLocale: "en",
      redirectOn: "root",
    },
    locales: [
      {
        code: "en",
        name: "English",
        iso: "en-US",
        language: "English",
        dir: "ltr"
      },
      {
        code: "fr",
        name: "Français",
        iso: "fr-FR",
        language: "French",
        dir: "ltr"
      },
      {
        code: "ar",
        name: "العربية",
        iso: "ar-AR",
        language: "Arabic",
        dir: "rtl"
      }
    ] as Locale[],
    defaultLocale: "en",
    strategy: "prefix_except_default"
  },

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