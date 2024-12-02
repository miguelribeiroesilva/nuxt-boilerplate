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

// Extend PrimeVue module options to include services
declare module '@nuxt/schema' {
  interface ModuleOptions {
    primevueSvcOptions?: {
      services?: {
        tooltip?: boolean;
        ripple?: boolean;
        confirmation?: boolean;
        dialog?: boolean;
        toast?: boolean;
        confirmDialog?: boolean;
      }
    }
  }
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
    './assets/css/cookiecontrol.css'
  ],

  imports: {
    dirs: [
      // scan all modules within `./composables`
      'composables/**',
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
    '@nuxtjs/device',
    '@nuxtjs/google-fonts',
    'nuxt-primevue',
    '@nuxt/image',
    '@nuxt/content',
    '@dargmuesli/nuxt-cookie-control'
  ],

  primevue: {
    components: {
      include: [
        // Layout Components
        'Divider',
        'Panel',
        'Sidebar',
        'Fieldset',
        'Card',
        'Toolbar',

        // Data Components
        'DataView',
        'DataViewLayoutOptions',
        'DataTable',
        'Column',
        'ColumnGroup',
        'OrganizationChart',
        'Row',
        'TreeTable',
        'Timeline',

        // Form Components
        'AutoComplete',
        'Calendar',
        'Checkbox',
        'Chips',
        'ColorPicker',
        'Dropdown',
        'Editor',
        'InputMask',
        'InputNumber',
        'InputSwitch',
        'InputText',
        'Knob',
        'ListBox',
        'MultiSelect',
        'Password',
        'RadioButton',
        'Rating',
        'Select',
        'Slider',
        'Textarea',

        // Button Components
        'Button',
        'ButtonGroup',
        'SpeedDial',
        'SplitButton',

        // Panel Components
        'Accordion',
        'AccordionTab',
        'TabView',
        'TabPanel',
        'Fieldset',
        'Carousel',

        // Overlay Components
        'Dialog',
        'ConfirmDialog',
        'OverlayPanel',
        'Tooltip',
        'ProgressSpinner',
        'Toast',

        // Menu Components
        'Menu',
        'ContextMenu',
        'Menubar',
        'PanelMenu',
        'Steps',
        'TabMenu',
        'TieredMenu',

        // Chart Components
        'Chart',

        // Media Components
        'Galleria',

        // Misc Components
        'Avatar',
        'Badge',
        'Chip',
        'Skeleton',
        'ProgressBar',
        'Tag',
        'Terminal'
      ]
    },
    cssLayerOrder: 'tailwind-base, primevue, tailwind-utilities' as any,
    options: {
      ripple: true,
      inputStyle: 'filled'
    },
    services: {
      tooltip: true,
      ripple: true,
      confirmDialog: true,
      toast: true
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
    barPosition: 'bottom-full',
    closeModalOnClickOutside: true,
    colors: {
      barBackground: '#12141C',
      barButtonBackground: '#3B82F6',
      barButtonColor: '#fff',
      barButtonHoverBackground: '#2563EB',
      barTextColor: '#fff',
      modalBackground: '#fff',
      modalButtonBackground: '#3B82F6',
      modalButtonColor: '#fff',
      modalButtonHoverBackground: '#2563EB',
      modalTextColor: '#000',
      checkboxActiveBackground: '#3B82F6',
      checkboxInactiveBackground: '#000',
      checkboxDisabledBackground: '#ddd',
      checkboxActiveCircleBackground: '#fff',
      checkboxInactiveCircleBackground: '#fff',
      checkboxDisabledCircleBackground: '#fff'
    },
    cookies: {
      necessary: [
        {
          description: {
            en: 'Used for user authentication and session management',
            fr: 'Utilisé pour l\'authentification et la gestion des sessions',
            ar: 'يستخدم للمصادقة وإدارة الجلسات'
          },
          id: 'authentication',
          name: {
            en: 'Authentication',
            fr: 'Authentification',
            ar: 'المصادقة'
          }
        }
      ],
      optional: [
        {
          description: {
            en: 'Used to understand how you use the site',
            fr: 'Utilisé pour comprendre comment vous utilisez le site',
            ar: 'يستخدم لفهم كيفية استخدامك للموقع'
          },
          id: 'analytics',
          name: {
            en: 'Analytics',
            fr: 'Analytique',
            ar: 'التحليلات'
          }
        }
      ]
    },
    isControlButtonEnabled: true,
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