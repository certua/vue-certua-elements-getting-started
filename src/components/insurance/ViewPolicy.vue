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

let policyId = ref('')
// lifecycle hooks
onMounted(() => {
  const route = useRoute()
  if (localStorage.getItem('elementType') !== 'insurance') {
    router.replace('/components/connect')
  }

  let configJson = localStorage.getItem('insuranceConfig')

  if (configJson) {
    config.value = configJson
  }

  let accessTokenJson = localStorage.getItem('certua-accessToken')
  if (accessTokenJson) {
    accessToken.value = accessTokenJson
  }

  policyId.value = route.params.id as string

  setTimeout(() => {
    loaded.value = true
  }, 500)
})
function goToQuoteAndBuy(value: any) {
  console.log('goToQuoteAndBuy event', value)
  router.replace({ name: '/components/quote-and-buy', state: { value } })
}
function goToMyPolicies() {
  router.replace('/components/policies-list')
}

function goToMakeAClaim(value: any) {
  console.log('makeAClaim event', value)
  router.replace({ name: 'fnol', state: { data: value.detail } })
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
    <p>This component displays a Policy for the supplied policy id</p>

    <div class="col-md-12" v-if="!policyId">
      <div class="alert alert-warning">
        You need to go to Policies list and click 'View' on the policy you wish to view
      </div>
      <div class="btn btn-primary mb-4" @click="goToMyPolicies()">Go to policies list</div>
    </div>

    <ae-insurance-confirmation
      v-if="loaded && !!policyId"
      :config="config"
      :accesstoken="accessToken"
      :policyId="policyId"
      :standalone="true"
      @backToCovers="(value: any) => goToMyPolicies()"
      @makeAClaim="(value: any) => goToMakeAClaim(value)"
      @goToQuoteAndBuy="(value: any) => goToQuoteAndBuy(value)"
    >
    </ae-insurance-confirmation>
  </div>
  <div>
    <h4>Example code</h4>
    <pre><code>
      &lt;ae-insurance-confirmation
      :config="config"
      :accesstoken="accessToken"
      :policyId="policyId"
      :standalone="true"
      @backToCovers="(value: any) => goToMyPolicies()"
      @makeAClaim="(value: any) => goToMyPolicies()"
      @goToQuoteAndBuy="(value: any) => goToQuoteAndBuy(value)"
      &lt;/ae-insurance-confirmation  &gt;
      </code>
    </pre>

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
    <!-- <pre> <code>{{ JSON.stringify(quickQuoteJson) }}</code></pre> -->

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
            <td>policyId</td>
            <td>Yes</td>
            <td>The policyId of the policy you are viewing</td>
          </tr>
          <tr>
            <td>standalone</td>
            <td>Yes</td>
            <td>This needs to be set to true</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
