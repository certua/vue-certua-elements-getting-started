<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { from, map, tap, catchError } from 'rxjs'
import axios from 'axios'
import { parseISO, add, roundToNearestMinutes } from 'date-fns'
import router from '@/router'
import { useRoute } from 'vue-router'
let showError = ref(false)
let config = ref()
let accessToken = ref()
let loaded = ref(false)

let clientId = ref('')
let organisationId = ref('')
// lifecycle hooks
onMounted(() => {
  const route = useRoute()
  if (localStorage.getItem('elementType') !== 'insurance') {
    router.replace('/components/connect')
  }

  let configJson = localStorage.getItem('insuranceConfig')

  if (!!configJson) {
    config.value = configJson
  }

  let accessTokenJson = localStorage.getItem('certua-accessToken')
  if (!!accessTokenJson) {
    accessToken.value = accessTokenJson
  }

  let loggedInUser = localStorage.getItem('certua-loggedInUser') ?? ''
  if (!!loggedInUser) {
    clientId.value = JSON.parse(loggedInUser).clientId
    organisationId.value = JSON.parse(loggedInUser).organisationId
  }
  setTimeout(() => {
    loaded.value = true
  }, 500)
})

function goToMyPolicies() {
  router.replace('/components/policies-list')
}
</script>

<template>
  <div class="row" v-if="showError">
    <div class="col">
      <h3>There is an issue with the site configuration</h3>
      <RouterLink to="/">Home</RouterLink>
    </div>
  </div>
  <div class="row" v-if="!showError">
    <h2>View Policy (v2)</h2>
    <p>
      This component displays the active policy for the supplied client/organisation as well as the
      ability to navigate to historic quotes/policies and via renewals
    </p>

    <certua-insurance-view-policy
      v-if="loaded"
      :config="config"
      :accesstoken="accessToken"
      :clientId="clientId"
      :organisationId="organisationId"
    >
    </certua-insurance-view-policy>
  </div>
  <div>
    <h4>Example code</h4>
    <pre><code>
      &lt;certua-insurance-view-policy
      :referrerSiteCode:="config.referrerId"
      :accesstoken="accessToken"
      :clientId="clientId"
      :organisationId="organisationId"

      &lt;/certua-insurance-view-policy  &gt;
      </code>
    </pre>
    <h4>Component specific inputs</h4>
    <div class="table-responsive">
      <table class="table">
        <thead>
          <th>Property Name</th>
          <th>Mandatory</th>

          <th>Description</th>
        </thead>
        <tbody></tbody>
      </table>
    </div>
  </div>
</template>
