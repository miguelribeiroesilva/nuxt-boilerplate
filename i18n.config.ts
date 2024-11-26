import en from "./locales/en.json";
import fr from "./locales/fr.json";
import ar from "./locales/ar.json";

export default defineI18nConfig(() => ({
  legacy: false,
  langDir: "./locales",
  messages: {
    "en": en,
    "fr": fr,
    "ar": ar
  },
  baseUrl: process.env.NUXT_PUBLIC_SITE_URL,
  locales: [
    {
      code: "en",
      iso: "en-US",
      isCatchallLocale: true,
    },
    {
      code: "fr",
      iso: "fr-FR"
    },
    {
      code: "ar",
      iso: "ar-AR"
    }
  ],
}))