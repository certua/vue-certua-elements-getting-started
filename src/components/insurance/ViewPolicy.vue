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

let policyId = ref('')
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

  policyId.value = route.params.id as string

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
      :allowCancel="true"
      :allowModifyDDetails="true"
      :standalone="true"
      :distributor="'MRSLEnterprise'"
    >
    </ae-insurance-confirmation>
  </div>
  <div>
    <h4>Example code</h4>
    <pre><code>
      &lt;ae-insurance-confirmation
      :referrerSiteCode:="config.referrerId"
      :accesstoken="accessToken"
      :clientId="clientId"
      :organisationId="organisationId"

      &lt;/ae-insurance-confirmation  &gt;
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
