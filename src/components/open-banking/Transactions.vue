<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { from, map, tap, catchError } from 'rxjs'
import axios from 'axios'
import { parseISO, add } from 'date-fns'
let showError = ref(false)
let contextTokenOptions = ref('')
let daasUrl = ref('')
let loaded = ref(false)
let redirectionConfig = {
  successUrl: window.location.origin + '/connect?accountConnection=success',
  failureUrl: window.location.origin + '/connect?accountConnection=failure'
}
let notificationSettings = {
  manualNotifications: false,
  useHostToastrStyles: false
}

// lifecycle hooks
onMounted(() => {
  if (localStorage.getItem('daasUrl')) {
    daasUrl.value = localStorage.getItem('daasUrl') ?? ''
  }
  loaded.value = true
})
</script>

<template>
  <NoTokenError
    @error="(value: any) => showError = value"
    @contextTokenOptions="(value: any) => contextTokenOptions = value"
  />
  <div class="row" v-if="!showError">
    <h2>Transactions</h2>
    <p>This component can be used to list and search a users transactions</p>
    <certua-ob-transactions
      :daasContextToken="contextTokenOptions"
      :daasUrl="daasUrl"
      :notificationSettings="notificationSettings"
      v-if="loaded"
    >
    </certua-ob-transactions>
  </div>
  <div>
    <h4>Example code</h4>
    <pre><code>
      &lt;certua-ob-transactions 
        :contextData="contextData"&gt;
        :daasUrl="daasUrl"
        :notificationSettings="notificationSettings"
      &lt;/certua-ob-transactions&gt;
      </code>
    </pre>
    <h4>Component specific inputs</h4>
    <div class="table-responsive">
      <table class="table">
        <thead>
          <th>Property Name</th>
          <th>Mandatory</th>
          <th>Region</th>
          <th>Description</th>
        </thead>
        <tbody></tbody>
      </table>
    </div>
  </div>
</template>
