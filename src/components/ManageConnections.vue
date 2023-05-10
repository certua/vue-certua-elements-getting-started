<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { from, map, tap, catchError } from 'rxjs'
import { parseISO, add } from 'date-fns'
import axios from 'axios'
let showError = ref(false)
let contextTokenOptions = ref('')
let daasUrl = ref('')
let loaded = ref(false)
let redirectionConfig = {
  successUrl: window.location.origin + '/connect?accountConnection=success',
  failureUrl: window.location.origin + '/connect?accountConnection=failure'
}
let contentOverrides = {
  'certua-ob-provider-permissions': {
    howWeAreUsingData: '<p>[Custom text about how you use data]</p>'
  },
  'certua-ob-manage-providers': {
    confirmDisconnect: {
      implicationOfRevocation: '<p>[Custom text about implications of revoke]</p>',
      whatHappens: '<p>[Custom text about what happens to data if they revoke] </p>',
      relink: '<p>[Custom text about ability to relink]</p>',
      confirm: '<p>[Custom text asking user to confirm]</p>',
      termsOfServiceLink: `<a href='#'>[Custom Link to Terms of service here]</a>`
    },
    disconnectSuccess: {
      implicationOfRevocation: '<p>[Custom text about implications of revoke]</p>',
      whatHappens: '<p>[Custom text about what happens to data now account are disconnected]</p>'
    }
  }
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
    <h2>Manage connections</h2>
    <p>This component can be used to view connected accounts, refresh consent or disconnect</p>
    <certua-ob-manage-connections
      :contentOverrides="contentOverrides"
      :daasContextToken="contextTokenOptions"
      :showTitle="false"
      :showAddButton="false"
      :daasUrl="daasUrl"
    >
    </certua-ob-manage-connections>
  </div>
  <div>
    <h4>Example code</h4>
    <pre><code>
      &lt;certua-ob-manage-connections 
        :contentOverrides="contentOverrides"
        :contextData="contextData"
        :showTitle="false"
        :daasUrl="daasUrl"
        :showAddButton="false"&gt;
      &lt;/certua-ob-manage-connections&gt;
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
          <td>contentOverrides</td>
          <td>No</td>
          <td>
            This is a JSON string which contains any text overrides that you want to pass to the
            information screens/modals<br /><code>
              { 'certua-ob-provider-permissions': { howWeAreUsingData: ' &lt;p&gt;[Custom text about
              how you use data]&lt;/p&gt; ' }, 'certua-ob-manage-providers': { confirmDisconnect: {
              implicationOfRevocation: ' &lt;p&gt;[Custom text about implications of
              revoke]&lt;/p&gt; ', whatHappens: ' &lt;p&gt;[Custom text about what happens to data
              if they revoke]&lt;/p&gt; ', relink: ' &lt;p&gt;[Custom text about ability to
              relink]&lt;/p&gt; ', confirm: ' &lt;p&gt;[Custom text asking user to
              confirm]&lt;/p&gt; ', termsOfServiceLink: `&lt;a href="#" &gt;[Custom Link to Terms of
              service here]&lt;/a &gt;` }, disconnectSuccess: { implicationOfRevocation: '
              &lt;p&gt;[Custom text about implications of revoke]&lt;/p&gt; ', whatHappens: '
              &lt;p&gt;[Custom text about what happens to data now account are
              disconnected]&lt;/p&gt; ' } } }
            </code>
          </td>
        </tr>
        <tr>
          <td>showTitle</td>
          <td>No</td>
          <td>This will show or hide the web components title (Open Banking Connected Accounts)</td>
        </tr>
        <tr>
          <td>showAddButton</td>
          <td>No</td>
          <td>
            This controls if the Add Account button is shown above the currently connected accounts.
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
