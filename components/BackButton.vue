<script setup lang="ts">
const router = useRouter();
</script>
<template>
  <Button severity="info" v-on:click="router.go(-1)"      >
        ←
      </Button>
</template>
