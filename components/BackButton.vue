<script setup lang="ts">
// import { useRouter } from '#imports'

const router = useRouter();
</script>
<template>
  <Button severity="info" v-on:click="router.go(-1)" class="mr-3">
    ←
  </Button>
</template>
