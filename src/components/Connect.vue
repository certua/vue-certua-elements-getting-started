<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { from, map, tap, catchError } from 'rxjs'
import axios from 'axios'
import { parseISO, add } from 'date-fns'
let showError = ref(false)
let contextTokenOptions = ref('')
let redirectionConfig = {
  successUrl: window.location.origin + '/components/connect?accountConnection=success',
  failureUrl: window.location.origin + '/components/connect?accountConnection=failure'
}

let contentOverrides = {
  'certua-ob-provider-permissions': {
    howWeAreUsingData: '<p>[Custom text about how you use data]</p>'
  },
  'certua-ob-manage-providers': {
    confirmDisconnect: {
      implicationOfRevocation: '<p>[Custom text about implications of revoke]</p>',
      whatHappens: '<p>[Custom text about what happens to data if they revoke] </p>',
      relink: '<p>[Custom text about ability to relink]</p>',
      confirm: '<p>[Custom text asking user to confirm]</p>',
      termsOfServiceLink: `<a href='#'>[Custom Link to Terms of service here]</a>`
    },
    disconnectSuccess: {
      implicationOfRevocation: '<p>[Custom text about implications of revoke]</p>',
      whatHappens: '<p>[Custom text about what happens to data now account are disconnected]</p>'
    }
  }
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
    <h2>Connect Accounts</h2>
    <p>
      This component can be used to facilitate a user connecting their bank account via Open Banking
    </p>
    <certua-ob-connect
      :contentOverrides="contentOverrides"
      :contextData="contextTokenOptions"
      :redirectionConfig="redirectionConfig"
    >
      <span slot="button" class="ml-auto"></span>
    </certua-ob-connect>
  </div>

  <div class="row" v-if="showError">
    <div class="col">
      <h3>You do not have a context token</h3>
      <RouterLink to="/">Home</RouterLink>
    </div>
  </div>
</template>
