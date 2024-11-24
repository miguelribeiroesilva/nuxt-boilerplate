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

  runtimeConfig: {
    public: {
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL,
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
    '@nuxtjs/i18n',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/color-mode',
    '@nuxtjs/device',
    ['@dargmuesli/nuxt-cookie-control', {
      cookieNameIsConsentGiven: 'ncc_c',
      cookieNameCookiesEnabledIds: 'ncc_e',
      isAcceptNecessaryButtonEnabled: true,
      isModalForced: false,
      isCookieIdVisible: false,
      barPosition: 'bottom-full',
      closeModalOnClickOutside: false,
      colors: {
        barBackground: '#fff',
        barButtonBackground: '#4F46E5',
        barButtonColor: '#fff',
        barButtonHoverBackground: '#4338CA',
        barTextColor: '#1F2937',
        modalBackground: '#fff',
        modalButtonBackground: '#4F46E5',
        modalButtonColor: '#fff',
        modalButtonHoverBackground: '#4338CA',
        modalTextColor: '#1F2937',
        checkboxActiveBackground: '#4F46E5',
        checkboxInactiveBackground: '#E5E7EB',
        checkboxDisabledBackground: '#D1D5DB',
        checkboxActiveCircleBackground: '#fff',
        checkboxInactiveCircleBackground: '#fff',
        checkboxDisabledCircleBackground: '#fff',
      },
      cookies: {
        necessary: [
          {
            id: 'necessary',
            name: {
              en: 'Necessary Cookies',
              fr: 'Cookies Nécessaires',
              ar: 'ملفات تعريف الارتباط الضرورية'
            },
            description: {
              en: 'These cookies are required for the website to function properly. They enable basic functions like page navigation and access to secure areas of the website.',
              fr: 'Ces cookies sont nécessaires au bon fonctionnement du site. Ils permettent les fonctions de base comme la navigation et l\'accès aux zones sécurisées du site.',
              ar: 'هذه الملفات ضرورية لعمل الموقع بشكل صحيح. تمكن الوظائف الأساسية مثل التنقل في الصفحات والوصول إلى المناطق الآمنة في الموقع.'
            },
            default: true,
            necessary: true
          }
        ],
        optional: [
          {
            id: 'analytics',
            name: {
              en: 'Analytics Cookies',
              fr: 'Cookies Analytiques',
              ar: 'ملفات تعريف الارتباط التحليلية'
            },
            description: {
              en: 'These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously.',
              fr: 'Ces cookies nous aident à comprendre comment les visiteurs interagissent avec notre site en collectant et en rapportant des informations de manière anonyme.',
              ar: 'تساعدنا هذه الملفات على فهم كيفية تفاعل الزوار مع موقعنا من خلال جمع المعلومات وإعداد التقارير بشكل مجهول.'
            },
            default: false
          },
          {
            id: 'functional',
            name: {
              en: 'Functional Cookies',
              fr: 'Cookies Fonctionnels',
              ar: 'ملفات تعريف الارتباط الوظيفية'
            },
            description: {
              en: 'These cookies enable enhanced functionality and personalization, such as live chat and other embedded content.',
              fr: 'Ces cookies permettent des fonctionnalités améliorées et une personnalisation, comme le chat en direct et d\'autres contenus intégrés.',
              ar: 'تمكن هذه الملفات الوظائف المحسنة والتخصيص، مثل الدردشة المباشرة والمحتوى المضمن الآخر.'
            },
            default: false
          }
        ]
      }
    }],
    'nuxt-icon',
    '@nuxt/content',
    '@nuxt/image',
    '@nuxtjs/google-fonts',
    '@pinia/nuxt',
  ],

  i18n: {
    baseUrl: process.env.NUXT_PUBLIC_SITE_URL,
    vueI18n: './i18n.config.ts',
    defaultLocale: 'en',
    strategy: 'prefix_except_default',
    langDir: "locales/",
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
    ],
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