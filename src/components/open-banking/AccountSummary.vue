<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { from, map, tap, catchError } from 'rxjs'
import { parseISO, add } from 'date-fns'
import axios from 'axios'
let showError = ref(false)
let contextTokenOptions = ref('')
let daasUrl = ref('')
let loaded = ref(false)
let sortOptions = ref({
  sortOrder: 'asc',
  sortFieldName: 'balance'
})
let limitTo = ref(undefined)
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
    <h2>Account Summary list</h2>
    <p>This component can be used to show an overview of all connected accounts</p>
    <certua-ob-account-summary-list
      :contextData="contextTokenOptions"
      :daasUrl="daasUrl"
      :limitTo="limitTo"
      :notificationSettings="notificationSettings"
      :sortOptions="sortOptions"
      v-if="loaded"
    >
    </certua-ob-account-summary-list>
  </div>

  <div>
    <h4>Example code</h4>
    <pre><code>
      &lt;certua-ob-account-summary-list 
        :contextData="contextData"&gt; 
          :daasUrl="daasUrl" 
            :limitTo="limitTo" 
            :sortOptions="sortOptions" 
            :notificationSettings="notificationSettings"
      &lt;/certua-ob-account-summary-list&gt;
      </code>
    </pre>

    <h4>Event bus messages</h4>
    <p>
      This component emits the total value of the account balances grouped by currency with the
      event type of <code>account-summary-balances</code>
    </p>
    <pre><code>
    {
  "balances": {
    "GBP": 123966.06,
    "EUR": 0
  }
}
    </code></pre>

    <h4>Component specific inputs</h4>
    <div class="table-responsive">
      <table class="table">
        <thead>
          <th>Property Name</th>
          <th>Mandatory</th>
          <th>Region</th>
          <th>Description</th>
        </thead>
        <tbody>
          <tr>
            <td>sortOptions</td>
            <td>No</td>
            <td>All</td>
            <td>
              This is JSON which allows you to set the sortFieldName and sortOrder. Currently
              limited to sortFieldName must be 'balance' and sortOrder 'asc' or 'desc'. If this is
              not passed then they are ordered by Provider name
              <br />
              <code> { "sortFieldName": "balance" , "sortOrder": "asc" } </code>
            </td>
          </tr>
          <tr>
            <td>limitTo</td>
            <td>No</td>
            <td>All</td>
            <td>
              This is an integer that controls how many accounts are shown.
              <br />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
