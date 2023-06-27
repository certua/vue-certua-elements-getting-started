<script setup lang="ts">
import { onMounted, ref } from 'vue'

let isProd = ref(false)

onMounted(() => {
  if (import.meta.env.VUE_ENVIRONMENT == 'prod') {
    isProd.value = true
  }
})
</script>

<template>
  <main>
    <div class="row" v-if="isProd">
      <div class="offset-md-4 col-md-4">
        <div class="alert alert-warning" role="alert">
          Proceed with caution: You are using the production version of the getting started app.
        </div>
      </div>
    </div>
  </main>
</template>
