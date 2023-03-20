<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { from, map, tap, catchError } from 'rxjs'
import axios from 'axios'
import { parseISO, add } from 'date-fns'
let showError = ref(false)
let contextTokenOptions = ref('')
let redirectionConfig = {
  successUrl: window.location.origin + '/connect?accountConnection=success',
  failureUrl: window.location.origin + '/connect?accountConnection=failure'
}
function checkExpiry() {
  let token = JSON.parse(localStorage.getItem('apiConfig') ?? '')
  let tokenCreation = parseISO(token.dateCreated)
  if (add(tokenCreation, { minutes: 30 }) <= new Date()) {
    showError.value = true
    localStorage.removeItem('apiConfig')
  }

  let root = document.documentElement
  if (!root.style.getPropertyValue('--primary')) {
    let primary = localStorage.getItem('--primary')
    root.style.setProperty('--primary', primary)

    let secondary = localStorage.getItem('--secondary')
    root.style.setProperty('--secondary', secondary)
  }
}

// lifecycle hooks
onMounted(() => {
  if (!localStorage.getItem('apiConfig')) {
    showError.value = true
  } else {
    checkExpiry()
    contextTokenOptions.value = JSON.parse(localStorage.getItem('apiConfig') ?? '')
  }
})
</script>

<template>
  <div class="row" v-if="!showError">
    <h2>Transactions</h2>
    <p>This component can be used to list and search a users transactions</p>
    <certua-ob-transactions :contextData="contextTokenOptions" :showAddButton="false">
    </certua-ob-transactions>
  </div>

  <div class="row" v-if="showError">
    <div class="col">
      <h3>You do not have a context token</h3>
      <RouterLink to="/">Home</RouterLink>
    </div>
  </div>
</template>
