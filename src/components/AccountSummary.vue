<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { from, map, tap, catchError } from 'rxjs'
import { parseISO, add } from 'date-fns'
import axios from 'axios'
let showError = ref(false)
let contextTokenOptions = ref('')
let daasUrl = ref('')
let loaded = ref(false)
let notificationSettings = {
  manualNotifications: false,
  useHostToastrStyles: false
}
function checkExpiry() {
  let token = JSON.parse(localStorage.getItem('apiConfig') ?? '')
  let tokenCreation = parseISO(token.dateCreated)
  if (add(tokenCreation, { minutes: 30 }) <= new Date()) {
    showError.value = true
    localStorage.removeItem('apiConfig')
  }

  let root = document.documentElement
  if (!root.style.getPropertyValue('--primary')) {
    let primary = localStorage.getItem('--primary')
    root.style.setProperty('--primary', primary)

    let secondary = localStorage.getItem('--secondary')
    root.style.setProperty('--secondary', secondary)
  }
}

// lifecycle hooks
onMounted(() => {
  if (!localStorage.getItem('apiConfig')) {
    showError.value = true
  } else {
    checkExpiry()
    contextTokenOptions.value = JSON.parse(localStorage.getItem('apiConfig') ?? '')
  }
  if (localStorage.getItem('daasUrl')) {
    daasUrl.value = localStorage.getItem('daasUrl') ?? ''
  }
  loaded.value = true
})
</script>

<template>
  <div class="row" v-if="!showError">
    <h2>Account Summary list</h2>
    <p>This component can be used to show an overview of all connected accounts</p>
    <certua-ob-account-summary-list
      :contextData="contextTokenOptions"
      :daasUrl="daasUrl"
      :notificationSettings="notificationSettings"
      v-if="loaded"
    >
    </certua-ob-account-summary-list>
  </div>

  <div>
    <h4>Example code</h4>
    <pre><code>
      &lt;certua-ob-account-summary-list 
        :contextData="contextData"&gt;   :daasUrl="daasUrl"   :notificationSettings="notificationSettings"
      &lt;/certua-ob-account-summary-list&gt;
      </code>
    </pre>
    <table class="table">
      <thead>
        <th>Property Name</th>
        <th>Mandatory</th>
        <th>Description</th>
      </thead>
      <tbody>
        <tr>
          <td>contextData</td>
          <td>Yes</td>
          <td>
            This is a JSON string which contains your context token and user reference. <br /><code>
              {"contextToken":"FF5D16AAE1ED74E4C8F0E8B6D9E2EB06","ownerId":"1","dateCreated":"2023-03-20T11:17:24.121Z"}
            </code>
          </td>
        </tr>
        <tr>
          <td>daasUrl</td>
          <td>No</td>
          <td>
            This only needs to be passed in if you wish to load the Daas Elements from your own CDN
            rather than Certua's. Must be an absolute URL.
          </td>
        </tr>
        <tr>
          <td>notificationSettings</td>
          <td>No</td>
          <td>
            This is JSON which contains any custom notification settings required for your
            implementation. By default this property is not required if you simply wish to use the
            default style toastrs.<br />
            Manual Notifications: if this is set to true then toastrs are disabled entirely and the
            host will be required to listen to 'certua-ob-notifications' channel on the eventbus.
            <br />Use External Toastr Styles: Intended for Internal Certua use, this leaves toastrs
            outside of the shadow dom and the host app has to manage ngx-toastr stylesheet
            <br />
            <code> { "manualNotifications": "boolean" , "useHostToastrStyles": "boolean" } </code>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <div class="row" v-if="showError">
    <div class="col">
      <h3>You do not have a context token</h3>
      <RouterLink to="/">Home</RouterLink>
    </div>
  </div>
</template>
