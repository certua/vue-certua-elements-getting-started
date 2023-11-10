<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { from, map, tap, catchError } from 'rxjs'
import axios from 'axios'
import { parseISO, add, roundToNearestMinutes } from 'date-fns'
import router from '@/router'
let showError = ref(false)
let config = ref()
let loaded = ref(false)

let prefill = ref()

let makeAClaimJson = ref({
  address: {
    addressLine1: '9 Anchor House',
    addressLine2: 'Anchor Quay',
    addressLine3: '',
    city: 'Norwich',
    country: 'UK',
    county: 'Norfolk',
    postCode: 'NR3 3XP',
    type: 'Correspondence'
  },
  insuredFullName: 'Chuck Allen',
  policyNumber: 'CER_TestPolicy-600-P005258'
})
// lifecycle hooks
onMounted(() => {
  if (localStorage.getItem('elementType') !== 'insurance') {
    router.replace('/components/connect')
  }

  let configJson = localStorage.getItem('insuranceConfig')

  if (configJson) {
    config.value = JSON.parse(configJson)
  }

  loaded.value = true

  console.log('state', window.history.state)
  prefill.value = window.history.state.data
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
    <h2>FNOL (First Notification of Loss)</h2>
    <p>This component displays an FNOL form</p>
    <certua-insurance-fnol :referrerSiteCode="config?.referrerId" :prefill="prefill" v-if="loaded">
    </certua-insurance-fnol>
  </div>
  <div>
    <h4>Example code</h4>
    <code>
      <pre>
      &lt;certua-insurance-fnol
      :referrerSiteCode:="config.referrerId"
        :prefill="prefill"
      &lt;/certua-insurance-fnol &gt;
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
        <tbody>
          <tr>
            <td>prefill</td>
            <td>No</td>
            <td>
              Data to prefill claims form. Emitted from View policy when user clicks 'Make a claim'
              Example:
              <code>{{ JSON.stringify(makeAClaimJson) }}</code>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
