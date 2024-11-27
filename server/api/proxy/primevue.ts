export default defineEventHandler(async (event) => {
  try {
    const response = await fetch('https://primevue.org/setup/');
    const html = await response.text();
    return html;
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch PrimeVue documentation'
    });
  }
});
