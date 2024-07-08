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
const docsUrl = import.meta.env.VITE_DOCS_URL
let clientId = ref('')
let organisationId = ref('')
// lifecycle hooks
onMounted(() => {
  if (localStorage.getItem('elementType') !== 'insurance') {
    router.replace('/open-banking/components/connect')
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
function goToQuoteAndBuy(value: any) {
  let newConfig = localStorage.getItem('insuranceConfig') as any
  newConfig = JSON.parse(newConfig)
  newConfig = {
    ...newConfig,
    quote: value.detail.quote
  }
  localStorage.setItem('insuranceConfig', JSON.stringify(newConfig))
  console.log('goToQuoteAndBuy event', value)
  router.replace({ name: 'quote-and-buy', state: { data: value.detail } })
}
let goToQuoteAndBuyJson = ref({
  quote: 'e.quote',
  policyId: 'e.policyId',
  restartJourney: 'e.restartJourney'
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
    <p>
      The documentation for this component can be found at
      <a
        target="_blank"
        .href="
        docsUrl +
        '/via-web-components/insurance-elements/quotes-list'
      "
        >{{ docsUrl + '/via-web-components/insurance-elements/quotes-list' }}</a
      >
    </p>
    <certua-insurance-quotes-list
      .clientId="clientId"
      .organisationId="organisationId"
      .basePath="'insurance/components/quotes-list'"
      @goToQuoteAndBuy="(value: any) => goToQuoteAndBuy(value)"
    >
    </certua-insurance-quotes-list>
  </div>
  <div>
    <h4>Example code</h4>
    <code>
      <pre>
      &lt;certua-insurance-quotes-list 
      .clientId="clientId"
      .organisationId="organisationId"
      .basePath="'insurance/components/quotes-list'"
      @goToQuoteAndBuy="(value: any) => goToQuoteAndBuy(value)"

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
          <tr>
            <td>basePath</td>
            <td>Yes</td>
            <td>base path displaying this component</td>
          </tr>
        </tbody>
      </table>
    </div>
    <h4>Output events</h4>
    <div class="table-responsive">
      <table class="table">
        <thead>
          <th>Event Name</th>
          <th>Data</th>
          <th>Description</th>
        </thead>
        <tbody>
          <tr>
            <td>goToQuoteAndBuy</td>
            <td>
              <code>{{ JSON.stringify(goToQuoteAndBuyJson) }}</code>
            </td>
            <td>xxxxxxxx</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
