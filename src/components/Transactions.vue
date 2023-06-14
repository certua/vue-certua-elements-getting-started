<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { from, map, tap, catchError } from 'rxjs'
import axios from 'axios'
import { parseISO, add } from 'date-fns'
let showError = ref(false)
let contextTokenOptions = ref('')
let daasUrl = ref('')
let loaded = ref(false)
let redirectionConfig = {
  successUrl: window.location.origin + '/connect?accountConnection=success',
  failureUrl: window.location.origin + '/connect?accountConnection=failure'
}
let notificationSettings = {
  manualNotifications: false,
  useHostToastrStyles: false
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
  if (localStorage.getItem('daasUrl')) {
    daasUrl.value = localStorage.getItem('daasUrl') ?? ''
  }
  loaded.value = true
})
</script>

<template>
  <div class="row" v-if="showError">
    <div class="col">
      <h3>You do not have a context token</h3>
      <RouterLink to="/">Home</RouterLink>
    </div>
  </div>
  <div class="row" v-if="!showError">
    <h2>Transactions</h2>
    <p>This component can be used to list and search a users transactions</p>
    <certua-ob-transactions
      :daasContextToken="contextTokenOptions"
      :daasUrl="daasUrl"
      :notificationSettings="notificationSettings"
      v-if="loaded"
    >
    </certua-ob-transactions>
  </div>
  <div>
    <h4>Example code</h4>
    <pre><code>
      &lt;certua-ob-transactions 
        :contextData="contextData"&gt;
        :daasUrl="daasUrl"
        :notificationSettings="notificationSettings"
      &lt;/certua-ob-transactions&gt;
      </code>
    </pre>
    <h4>Component specific inputs</h4>
    <table class="table">
      <thead>
        <th>Property Name</th>
        <th>Mandatory</th>
        <th>Region</th>
        <th>Description</th>
      </thead>
      <tbody></tbody>
    </table>
  </div>
</template>
