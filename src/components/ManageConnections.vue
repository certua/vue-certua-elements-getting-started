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
let contentOverrides = {
  'certua-ob-provider-permissions': {
    howWeAreUsingData: '<p>[Custom text about how you use data]</p>'
  },
  'certua-ob-manage-providers': {
    confirmDisconnect: {
      implicationOfRevocation: '<p>[Custom text about implications of revoke]</p>',
      whatHappens: '<p>[Custom text about what happens to data if they revoke] </p>',
      relink: '<p>[Custom text about ability to relink]</p>',
      confirm: '<p>[Custom text asking user to confirm]</p>'
    },
    disconnectSuccess: {
      implicationOfRevocation: '<p>[Custom text about implications of revoke]</p>',
      whatHappens: '<p>[Custom text about what happens to data now account are disconnected]</p>'
    }
  }
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
    <certua-ob-manage-connections
      :contentOverrides="contentOverrides"
      :daasContextToken="contextTokenOptions"
      :showAddButton="false"
    >
    </certua-ob-manage-connections>
  </div>

  <div class="row" v-if="showError">
    <div class="col">
      <h3>You do not have a context token</h3>
      <RouterLink to="/">Home</RouterLink>
    </div>
  </div>
</template>
