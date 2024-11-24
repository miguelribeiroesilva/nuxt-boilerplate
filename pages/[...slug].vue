<script setup>
// Throw 404 error for any unmatched route
throw createError({ statusCode: 404, statusMessage: 'Page Not Found' })
</script>
