<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { from, map, tap, catchError } from 'rxjs'
import axios from 'axios'
import { parseISO, add, roundToNearestMinutes } from 'date-fns'
import router from '@/router'
let showError = ref(false)
let config = ref('')
let accessToken = ref('')
let loaded = ref(false)
// lifecycle hooks
onMounted(() => {
  if (localStorage.getItem('elementType') == 'open-banking') {
    router.replace('/components/connect')
  }

  let configJson = localStorage.getItem('insuranceConfig')

  if (configJson) {
    config.value = configJson
  }

  accessToken.value = localStorage.getItem('certua-accessToken') ?? ''

  loaded.value = true

  console.log('state', window.history.state)
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
    <h2>Quote and buy</h2>
    <p>This component displays a Quote and buy Journey</p>
    <mf-insurance-journey
      :config="config"
      :accesstoken="accessToken"
      v-if="!!loaded"
    ></mf-insurance-journey>
  </div>
  <div>
    <h4>Example code</h4>
    <pre><code>
      &lt;mf-insurance-journey 
        :config="config"
        :accesstoken="accessToken"
      &lt;/mf-insurance-journey &gt;
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
      </table>
    </div>
  </div>
</template>
