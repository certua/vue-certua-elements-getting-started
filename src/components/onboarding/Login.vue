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
let loginSuccess = ref(false)

// lifecycle hooks
onMounted(() => {
  if (localStorage.getItem('elementType') !== 'insurance') {
    router.replace('/components/connect')
  }

  let configJson = localStorage.getItem('insuranceConfig')

  if (!!configJson) {
    config.value = JSON.parse(configJson)
  }

  accessToken.value = localStorage.getItem('certua-accessToken')

  if (!!accessToken.value) {
    loginSuccess.value = true
  }

  loaded.value = true
})

function setLoginSuccess(value) {
  loginSuccess.value = value
}

function setLoginFailure(value) {
  loginSuccess.value = !value
}

function logOut() {
  localStorage.removeItem('certua-accessToken')
  loginSuccess.value = false
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
    <h2>Login</h2>
    <p>
      This component allows you to login to a site so you can access a client/organisations
      quotes/policies
    </p>
    <certua-ae-login
      v-if="!loginSuccess"
      :referrerSiteCode="config?.referrerId"
      @loginSuccess="(value: any) => setLoginSuccess(value)"
      @loginFailure="(value: any) => setLoginFailure(value)"
    ></certua-ae-login>

    <div class="col-md-12" v-if="loginSuccess">
      <div class="alert alert-success">You are already logged in</div>
      <div class="btn btn-primary mb-4" @click="logOut()">Logout</div>
    </div>
  </div>
  <div>
    <h4>Example code</h4>
    <pre><code>
      &lt;certua-ae-login  :referrerSiteCode:="config.referrerId"
      @loginSuccess="(value: any) => setLoginSuccess(value)"
      @loginFailure="(value: any) => setLoginFailure(value)"
      &lt;/certua-ae-login &gt;
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
