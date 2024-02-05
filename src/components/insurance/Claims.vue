<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { from, map, tap, catchError } from 'rxjs'
import axios from 'axios'
import { parseISO, add, roundToNearestMinutes } from 'date-fns'
import router from '@/router'
let showError = ref(false)
let config = ref()
let accessToken = ref('')
let loaded = ref(false)
const docsUrl = import.meta.env.VITE_DOCS_URL
// lifecycle hooks
onMounted(() => {
  let configJson = localStorage.getItem('insuranceConfig')

  if (configJson) {
    config.value = JSON.parse(configJson)
  }

  accessToken.value = localStorage.getItem('certua-accessToken')

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
    <h2>Claims</h2>
    <p>This component displays Claims Information</p>
    <p>
      The documentation for this component can be found at
      <a
        target="_blank"
        .href="
        docsUrl +
        '/via-web-components/insurance-elements/claims'
      "
        >{{ docsUrl + '/via-web-components/insurance-elements/claims' }}</a
      >
    </p>
    <certua-insurance-claims-information .referrerSiteCode="config?.referrerId" v-if="loaded">
    </certua-insurance-claims-information>
  </div>
  <div>
    <h4>Example code</h4>
    <code>
      <pre>
      &lt;certua-insurance-claims-information
      .referrerSiteCode:="config.referrerId"

      &lt;/certua-insurance-claims-information &gt;
      </pre>
    </code>

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
