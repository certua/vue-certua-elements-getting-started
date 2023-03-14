<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { from, map, tap, catchError } from 'rxjs'
import axios from 'axios'
let showError = ref(false)
let contextTokenOptions = ref('')
let redirectionConfig = {
  successUrl: window.location.origin + '/connect?accountConnection=success',
  failureUrl: window.location.origin + '/connect?accountConnection=failure'
}
// lifecycle hooks
onMounted(() => {
  if (!localStorage.getItem('contextTokenOptions')) {
    showError.value = true
  } else {
    contextTokenOptions.value = JSON.parse(localStorage.getItem('contextTokenOptions') ?? '')
  }
})
</script>

<template>
  <div class="row" v-if="!showError">
    <certua-ob-cashflow :daasContextToken="contextTokenOptions" :showAddButton="false">
    </certua-ob-cashflow>
  </div>

  <div class="row" v-if="showError">
    <div class="col">
      <h3>You do not have a context token</h3>
      <RouterLink to="/">Home</RouterLink>
    </div>
  </div>
</template>
