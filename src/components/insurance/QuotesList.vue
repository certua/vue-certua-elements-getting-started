<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { from, map, tap, catchError } from 'rxjs'
import axios from 'axios'
import { parseISO, add, roundToNearestMinutes } from 'date-fns'
import router from '@/router'
let showError = ref(false)
let config = ref()
let accessToken = ref()
let loaded = ref(false)

let clientId = ref('')
let organisationId = ref('')
// lifecycle hooks
onMounted(() => {
  if (localStorage.getItem('elementType') !== 'insurance') {
    router.replace('/components/connect')
  }

  let configJson = localStorage.getItem('insuranceConfig')

  if (!!configJson) {
    config.value = JSON.parse(configJson)
  }

  accessToken.value = localStorage.getItem('certua-accessToken')

  let loggedInUser = localStorage.getItem('certua-loggedInUser') ?? ''
  if (!!loggedInUser) {
    clientId.value = JSON.parse(loggedInUser).clientId
    organisationId.value = JSON.parse(loggedInUser).organisationId
  }

  loaded.value = true
})
</script>

<template>
  <div class="row" v-if="showError">
    <div class="col">
      <h3>There is an issue with the site configuration</h3>
      <RouterLink to="/">Home</RouterLink>
    </div>
  </div>
  <div class="row" v-if="!showError">
    <h2>Quotes List</h2>
    <p>This component displays Quotes for the logged in client/organisation</p>
    <certua-insurance-quotes-list
      :referrerSiteCode="config?.referrerId"
      :accesstoken="accessToken"
      :clientId="clientId"
      :organisationId="organisationId"
    >
    </certua-insurance-quotes-list>
  </div>
  <div>
    <h4>Example code</h4>
    <code>
      <pre>
      &lt;certua-insurance-quotes-list 
      :referrerSiteCode:="config.referrerId"
      :accesstoken="accessToken"
      :clientId="clientId"
      :organisationId="organisationId"

      &lt;/certua-insurance-quotes-list  &gt;
    </pre
      >
    </code>
    <h4>Component specific inputs</h4>
    <div class="table-responsive">
      <table class="table">
        <thead>
          <th>Property Name</th>
          <th>Mandatory</th>

          <th>Description</th>
        </thead>

        <tbody>
          <tr>
            <td>clientId</td>
            <td>If entity type is Individual</td>
            <td>Pass clientId if entity type is Individual</td>
          </tr>
          <tr>
            <td>organisationId</td>
            <td>If entity type is Organisation</td>
            <td>Pass organisationId if entity type is Organisation</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
