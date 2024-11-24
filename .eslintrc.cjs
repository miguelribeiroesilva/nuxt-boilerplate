module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  parserOptions: {
    parser: "@typescript-eslint/parser",
    requireConfigFile: false,
    ecmaVersion: 2022,
    sourceType: "module",
  },
  extends: [
    "plugin:nuxt/recommended",
    "@nuxtjs/eslint-config-typescript",
    "plugin:prettier/recommended",
  ],
  plugins: ["prettier"],
  rules: {
    "no-console": "off",
    "vue/no-self-closing-void-elements": "off"
  },
};
