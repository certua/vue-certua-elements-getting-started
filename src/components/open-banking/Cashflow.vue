<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { from, map, tap, catchError } from 'rxjs'
import { parseISO, add, lastDayOfDecade } from 'date-fns'
import NoTokenError from '../NoTokenError.vue'
import axios from 'axios'
let showError = ref(false)
let contextTokenOptions = ref('')
let daasUrl = ref('')
let loaded = ref(false)
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
    <h2>Cashflow</h2>
    <p>This component can be used to display a graph of a users income vs expenditure</p>
    <certua-ob-cashflow
      :daasContextToken="contextTokenOptions"
      :daasUrl="daasUrl"
      :notificationSettings="notificationSettings"
      v-if="loaded"
    >
    </certua-ob-cashflow>
  </div>
  <div>
    <h4>Example code</h4>
    <pre><code>
      &lt;certua-ob-cashflow 
        :contextData="contextData"
        :daasUrl="daasUrl"
        :notificationSettings="notificationSettings"
      &lt;/certua-ob-cashflow&gt;
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
