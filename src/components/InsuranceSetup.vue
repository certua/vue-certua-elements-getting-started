<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { from, map, tap, catchError } from 'rxjs'
import axios, { formToJSON } from 'axios'

import router from '@/router'
import { parseISO, add } from 'date-fns'
enum Step {
  DfpAccessToken,
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

let clientId = ref('')
let clientSecret = ref('')

const step = ref(Step.DfpAccessToken)

let primaryColor = ref('#007fc6')
let secondaryColor = ref('')

let daasUrl = ref('')
let username = ''
let password = ''
let countryCode = ref('')
// functions that mutate state and trigger updates##

function reset() {
  step.value = Step.DfpAccessToken
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
  // const authUKUrl = 'https://identitydev.certua.io/realms/Certua/protocol/openid-connect/token'
  // const authAUUrl = 'https://identitydev-au.certua.io/realms/Certua/protocol/openid-connect/token'
  // // UK 'https://identitydev.certua.io/oauth/token?grant_type=client_credentials';
  // //STAGING URL
  // //const authUrl =
  // //  'https://iqstgauth.certua.io/oauth/token?grant_type=client_credentials';
  // const authUrl = countryCode.value === 'UK' ? authUKUrl : authAUUrl
  // //const body = new HttpParams().set('grant_type', 'client_credentials');
  // axios
  //   .post(
  //     authUrl,
  //     { grant_type: 'client_credentials' },
  //     {
  //       auth: { username: username, password: password },
  //       headers: {
  //         'Content-Type': 'application/x-www-form-urlencoded'
  //       }
  //     }
  //   )
  //   .then((response) => {
  //     accessToken = response.data.access_token
  //     step.value = Step.ContextToken
  //   })
  step.value = Step.Success
}
function goToComponents() {
  router.push('/components/connect')
}
// function getContextToken() {
//   const tokenAUUrl = 'https://apidev-au.certua.io/daas/app/token'
//   const tokenUKUrl = 'https://apidev.certua.io/daas/app/token'

//   //STG
//   //const tokenUrl = 'https://apistg.certua.io/daas/app/token';

//   const tokenUrl = countryCode.value === 'UK' ? tokenUKUrl : tokenAUUrl
//   let body = {
//     'client.integration.datasource.preference': ['OpenBanking', 'Yodlee', 'Yapily'],
//     'client.integration.user.reference': userReference // this is your reference for your client
//   } as any
//   if (countryCode.value == 'AU') {
//     body['client.integration.sub-tenant.reference'] = '12499'
//     body['client.integration.adviser.reference'] = '9163'
//   }
//   from(
//     axios.post(tokenUrl, body, {
//       headers: { authorization: `Bearer ${accessToken}` }
//     })
//   )
//     .pipe(
//       map((response: any) => (contextToken = response.data.context_token)),
//       tap((token: string) =>
//         localStorage.setItem(
//           'apiConfig',
//           JSON.stringify({
//             contextToken: token,
//             ownerId: userReference,
//             dateCreated: new Date(),
//             countryCode: this.countryCode
//           })
//         )
//       ),
//       tap(() => (apiConfig = <string>localStorage.getItem('apiConfig'))),

//       tap(() => (step.value = Step.Styles)),
//       catchError(() => {
//         step.value = Step.Error
//       })
//     )
//     .subscribe()
// }

// function setUrl() {
//   if (!daasUrl.value) {
//     useDefaultUrl()
//   } else {
//     localStorage.setItem('daasUrl', daasUrl.value)
//     step.value = Step.Success
//   }
// }
// function useDefaultUrl() {
//   localStorage.removeItem('daasUrl')
//   step.value = Step.Success
// }

function startAgain() {
  localStorage.clear()
  router.push('/components/connect')
}

// function setStyles() {
//   let root = document.documentElement

//   root.style.setProperty('--primary', primaryColor.value)
//   root.style.setProperty('--secondary', secondaryColor.value)

//   localStorage.setItem('--primary', primaryColor.value)
//   localStorage.setItem('--secondary', secondaryColor.value)
//   step.value = Step.DaasUrl
// }
// function checkExpiry() {
//   let token = JSON.parse(localStorage.getItem('apiConfig') ?? '')
//   let tokenCreation = parseISO(token.dateCreated)
//   if (add(tokenCreation, { minutes: 30 }) <= new Date()) {
//     step.value = Step.AccessToken
//     localStorage.removeItem('apiConfig')
//   } else {
//     step.value = Step.Success
//   }
// }

// lifecycle hooks
onMounted(() => {
  // if (localStorage.getItem('apiConfig')) {
  //   checkExpiry()
  // }
})
</script>

<template>
  <div class="row">
    <div class="col-md-6 offset-md-3 text-center">
      <h3>Insurance Elements</h3>
      <!-- Start INS Setup Steps -->

      <h1>Coming soon</h1>

      <!-- <div class="row" v-if="step == Step.DfpAccessToken">
        <div class="col">
          <h3>Firstly, we need an access token</h3>
          <div class="text-start">
            <label for="clientId" class="form-label">Client ID</label>
            <input id="clientId" type="text" class="form-control" v-model="clientId" />
            <label for="clientSecret" class="label">Client Secret</label>
            <input id="clientSecret" type="password" v-model="clientSecret" class="form-control" />

            <button class="btn btn-primary mt-2" @click="getAccessToken()">Get Token</button>
          </div>
        </div>
      </div>

      <div class="row" v-if="step == Step.Success">
        <div class="col">
          <h3>Success you can now using Insurance elements</h3>
          <button class="btn btn-link" @click="goToComponents()">Go to components</button>
          <button class="btn btn-secondary mt-2 ms-2" @click="startAgain()">Start again</button>
        </div>
      </div>
      <div class="row" v-if="step == Step.Error">
        <div class="col">
          <h3>Something went wrong. Please try again</h3>
          <button class="btn btn-primary mt-3" @click="reset()">Try again</button>
        </div>
      </div> -->
    </div>
  </div>
</template>
