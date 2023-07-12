<script setup lang="ts">
defineProps<{
  msg: string
}>()
</script>

<template>
  <div class="greetings text-center">
    <h1 class="green mt-4">{{ msg }}</h1>
    <h5>Welcome to Certua's Getting Started App</h5>
  </div>
</template>

<style scoped></style>
