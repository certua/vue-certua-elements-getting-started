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
const docsUrl = import.meta.env.VITE_DOCS_URL
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

let goToQuoteAndBuyJson = ref({
  quote: 'e.quote',
  policyId: 'e.policyId',
  restartJourney: 'e.restartJourney'
})

// lifecycle hooks
onMounted(() => {
  const route = useRoute()
  if (localStorage.getItem('elementType') !== 'insurance') {
    router.replace('/open-banking/components/connect')
  }

  let configJson = localStorage.getItem('insuranceConfig')

  if (configJson) {
    config.value = configJson
  }

  let accessTokenJson = localStorage.getItem('certua-accessToken')
  if (accessTokenJson) {
    accessToken.value = accessTokenJson
  }

  let loggedInUser = localStorage.getItem('certua-loggedInUser') ?? ''
  if (loggedInUser) {
    clientId.value = JSON.parse(loggedInUser).clientId
    organisationId.value = JSON.parse(loggedInUser).organisationId
  }
  setTimeout(() => {
    loaded.value = true
  }, 500)
})

function goToMakeAClaim(value: any) {
  console.log('makeAClaim event', value)
  router.replace({ name: 'fnol', state: { data: value.detail } })
}

function goToQuoteAndBuy(value: any) {
  console.log('goToQuoteAndBuy event', value)
  router.replace({ name: '/insurance/components/quote-and-buy', state: { value } })
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
    <h2>View Policy</h2>
    <p>
      Please note that you will need to be logged in to view the policy. If the account has a quote
      and not a policy you will need to go to the quotes list component.
    </p>
    <p>
      The documentation for this component can be found at
      <a
        target="_blank"
        .href="
        docsUrl +
        '/via-web-components/insurance-elements/view-policy'
      "
        >{{ docsUrl + '/via-web-components/insurance-elements/view-policy' }}</a
      >
    </p>
    <certua-insurance-view-policy
      v-if="loaded"
      .config="config"
      @makeAClaim="(value: any) => goToMakeAClaim(value)"
      @goToQuoteAndBuy="(value: any) => goToQuoteAndBuy(value)"
    >
    </certua-insurance-view-policy>
  </div>
  <div>
    <h4>Example code</h4>
    <code>
      <pre>
      &lt;certua-insurance-view-policy
      .config="config"
      @makeAClaim="(value: any) => goToMakeAClaim(value)"
      @goToQuoteAndBuy="(value: any) => goToQuoteAndBuy(value)"

      &lt;/certua-insurance-view-policy&gt;
      </pre>
    </code>

    <h4>Output events</h4>
    <table class="table">
      <thead>
        <th>Event Name</th>
        <th>Data</th>
        <th>Description</th>
      </thead>
      <tbody>
        <tr>
          <td>backToCovers</td>
          <td>None</td>
          <td>User has clicked back to covers link</td>
        </tr>
        <tr>
          <td>makeAClaim</td>
          <td>
            <code>{{ JSON.stringify(makeAClaimJson) }}</code>
          </td>
          <td>
            User has clicked make a claim button (if present- this is a product config setting),
            this emits the prefill info which can be used to prepopulate the FNOL claim form
          </td>
        </tr>
        <tr>
          <td>goToQuoteAndBuy</td>
          <td>
            <code>{{ JSON.stringify(goToQuoteAndBuyJson) }}</code>
          </td>
          <td>xxxxxxxx</td>
        </tr>
      </tbody>
    </table>
    <h4>Component specific inputs</h4>
    <code>None</code>
  </div>
</template>
