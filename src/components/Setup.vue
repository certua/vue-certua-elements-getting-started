<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { from, map, tap, catchError } from 'rxjs'
import axios, { formToJSON } from 'axios'
import Welcome from './Welcome.vue'
import { environment } from '@/environments/environment'
import router from '@/router'
import { parseISO, add } from 'date-fns'
enum Step {
  AccessToken,
  ContextToken,
  Styles,
  Success,
  Error
}
// reactive state
let userReference = ''
let accessToken = ref('')
let contextToken = ref({})

let apiConfig = {}

const step = ref(Step.AccessToken)

let primaryColor = ref('#007fc6')
let secondaryColor = ref('')

let username = ''
let password = ''
// functions that mutate state and trigger updates##

function reset() {
  step.value = Step.AccessToken
}

function back(chosenStep: Step) {
  step.value = chosenStep
}

function loadScript(url: string) {
  const componentJS = document.createElement('script')
  componentJS.className = 'environment-script'
  componentJS.async = true
  componentJS.src = url

  document.head.appendChild(componentJS)
}
function getAccessToken() {
  //const authUrl = 'https://iqdevauth.certua.io/oauth/token?grant_type=client_credentials'
  //STAGING URL
  const authUrl = 'https://iqstgauth.certua.io/oauth/token?grant_type=client_credentials'

  axios
    .post(
      authUrl,
      {},
      {
        auth: { username: username, password: password }
      }
    )
    .then((response) => {
      accessToken = response.data.access_token
      step.value = Step.ContextToken
    })
}
function goToComponents() {
  router.push('/components/connect')
}
function getContextToken() {
  //const tokenUrl = 'https://iqdevdaas.certua.io/app/token'
  //STAGING URL
  const tokenUrl = 'https://iqstgdaas.certua.io/app/token'
  const body = {
    'client.integration.datasource.preference': ['OpenBanking', 'Yodlee'],
    'client.integration.user.reference': userReference // this is your reference for your client
  }
  from(
    axios.post(tokenUrl, body, {
      headers: { authorization: `Bearer ${accessToken}` }
    })
  )
    .pipe(
      map((response: any) => (contextToken = response.data.context_token)),
      tap((token: string) =>
        localStorage.setItem(
          'apiConfig',
          JSON.stringify({
            contextToken: token,
            ownerId: userReference,
            dateCreated: new Date()
          })
        )
      ),
      tap(() => (apiConfig = <string>localStorage.getItem('apiConfig'))),

      tap(() => (step.value = Step.Styles)),
      catchError(() => {
        step.value = Step.Error
      })
    )
    .subscribe()
}

function setStyles() {
  let root = document.documentElement

  root.style.setProperty('--primary', primaryColor.value)
  root.style.setProperty('--secondary', secondaryColor.value)

  localStorage.setItem('--primary', primaryColor.value)
  localStorage.setItem('--secondary', secondaryColor.value)
  step.value = Step.Success
}
function checkExpiry() {
  let token = JSON.parse(localStorage.getItem('apiConfig') ?? '')
  let tokenCreation = parseISO(token.dateCreated)
  if (add(tokenCreation, { minutes: 30 }) <= new Date()) {
    step.value = Step.AccessToken
    localStorage.removeItem('apiConfig')
  } else {
    step.value = Step.Success
  }
}

// lifecycle hooks
onMounted(() => {
  if (localStorage.getItem('apiConfig')) {
    checkExpiry()
  }
})
</script>

<template>
  <div class="row">
    <div class="col-md-6 offset-md-3 text-center">
      <div class="mt-4">
        <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="125" height="125" />

        <div class="ms-2">
          <Welcome msg="Let's go" />
        </div>
      </div>
    </div>
    <div class="col-md-6 offset-md-3 text-center">
      <div class="row" v-if="step == Step.AccessToken">
        <div class="col">
          <h3>Firstly, we need an access token</h3>
          <div class="text-start">
            <label for="username" class="form-label">Username</label>
            <input id="username" type="text" class="form-control" v-model="username" />
            <label for="password" class="label">Password</label>
            <input id="password" type="password" v-model="password" class="form-control" />

            <button class="btn btn-primary mt-2" @click="getAccessToken()">Get Token</button>
          </div>
        </div>
      </div>

      <div class="row" v-if="step == Step.ContextToken">
        <div class="col">
          <h3>Now we can get a context token using that access token</h3>
          <div class="text-start">
            <label for="contextToken" class="form-label">Access Token</label>
            <input id="contextToken" type="text" class="form-control" v-model="accessToken" />
            <label for="userReference" class="form-label">User Reference</label>
            <input id="userReference" type="text" class="form-control" v-model="userReference" />
            <button class="btn btn-outline-primary mt-3" @click="back(Step.AccessToken)">
              Back
            </button>
            <button class="btn btn-primary mt-3 ms-2" @click="getContextToken()">
              Get Context Token
            </button>
          </div>
        </div>
      </div>

      <div class="row" v-if="step == Step.Styles">
        <div class="col">
          <h3>Now, choose some colours</h3>
          <div class="text-start">
            <label for="primary" class="form-label">Primary</label>
            <input id="primary" type="text" class="form-control" v-model="primaryColor" />
            <label for="secondary" class="label">Secondary</label>
            <input id="secondary" type="text" v-model="secondaryColor" class="form-control" />
            <button class="btn btn-outline-primary mt-2" @click="back(Step.ContextToken)">
              Back
            </button>
            <button class="btn btn-primary mt-2 ms-2" @click="setStyles()">Set styles</button>
          </div>
        </div>
      </div>

      <div class="row" v-if="step == Step.Success">
        <div class="col">
          <h3>Success you can now using Open banking elements</h3>
          <button class="btn btn-link" @click="goToComponents()">Go to components</button>
        </div>
      </div>
      <div class="row" v-if="step == Step.Error">
        <div class="col">
          <h3>Something went wrong. Please try again</h3>
          <button class="btn btn-primary mt-3" @click="reset()">Try again</button>
        </div>
      </div>
    </div>
  </div>
</template>
