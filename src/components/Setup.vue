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
  DaasUrl,
  Success,
  Error
}
// reactive state
let userReference = ''
let accessToken = ref('')
let contextToken = ref({})
let notificationSettings = {
  manualNotifications: false,
  useHostToastrStyles: false
}
let apiConfig = {}

const step = ref(Step.AccessToken)

let primaryColor = ref('#007fc6')
let secondaryColor = ref('')

let daasUrl = ref('')
let username = ''
let password = ''
let countryCode = ref('')
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
  const authUKUrl = 'https://identitydev.certua.io/realms/Certua/protocol/openid-connect/token'
  const authAUUrl = 'https://identitydev-au.certua.io/realms/Certua/protocol/openid-connect/token'
  // UK 'https://identitydev.certua.io/oauth/token?grant_type=client_credentials';
  //STAGING URL
  //const authUrl =
  //  'https://iqstgauth.certua.io/oauth/token?grant_type=client_credentials';
  const authUrl = countryCode.value === 'UK' ? authUKUrl : authAUUrl
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
  const tokenAUUrl = 'https://apidev-au.certua.io/daas/app/token'
  const tokenUKUrl = 'https://apidev.certua.io/daas/app/token'

  //STG
  //const tokenUrl = 'https://apistg.certua.io/daas/app/token';

  const tokenUrl = countryCode.value === 'UK' ? tokenUKUrl : tokenAUUrl
  let body = {
    'client.integration.datasource.preference': ['OpenBanking', 'Yodlee', 'Yapily'],
    'client.integration.user.reference': userReference // this is your reference for your client
  } as any
  if (countryCode.value == 'AU') {
    body['client.integration.sub-tenant.reference'] = '12499'
    body['client.integration.adviser.reference'] = '9163'
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

function setUrl() {
  if (!daasUrl.value) {
    useDefaultUrl()
  } else {
    localStorage.setItem('daasUrl', daasUrl.value)
    step.value = Step.Success
  }
}
function useDefaultUrl() {
  localStorage.removeItem('daasUrl')
  step.value = Step.Success
}

function startAgain() {
  localStorage.clear()
  step.value = Step.AccessToken
}

function setStyles() {
  let root = document.documentElement

  root.style.setProperty('--primary', primaryColor.value)
  root.style.setProperty('--secondary', secondaryColor.value)

  localStorage.setItem('--primary', primaryColor.value)
  localStorage.setItem('--secondary', secondaryColor.value)
  step.value = Step.DaasUrl
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
            <label for="countryCode" class="form-label">Country</label>
            <input id="countryCpde" type="text" class="form-control" v-model="countryCode" />
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

      <div class="row" v-if="step == Step.DaasUrl">
        <div class="col">
          <h3>Do you need to use a custom Daas URL?</h3>
          <p>
            Some consumers need to load their own version of our DaaS components from their own CDN,
            to do this enter the absolute URL to the script file in the box below, otherwise choose
            'Use Certua Defaults'
          </p>
          <button class="btn btn-secondary mt-2 ms-2" @click="useDefaultUrl()">
            No, use Certua Defaults
          </button>
          <div class="text-start">
            <label for="daasUrl" class="form-label">Daas URL</label>
            <input id="daasUrl" type="text" class="form-control" v-model="daasUrl" />

            <button class="btn btn-outline-primary mt-2" @click="back(Step.Styles)">Back</button>
            <button class="btn btn-primary mt-2 ms-2" @click="setUrl()">Set URL</button>
          </div>
        </div>
      </div>

      <div class="row" v-if="step == Step.Success">
        <div class="col">
          <h3>Success you can now using Open banking elements</h3>
          <button class="btn btn-link" @click="goToComponents()">Go to components</button>
          <button class="btn btn-secondary mt-2 ms-2" @click="startAgain()">Start again</button>
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
