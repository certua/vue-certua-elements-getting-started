<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { from, map, tap, catchError } from 'rxjs'
import { parseISO, add } from 'date-fns'
import axios from 'axios'
import NoTokenError from '../NoTokenError.vue'
enum ViewMode {
  Current,
  History
}
let showError = ref(false)
let contextTokenOptions = ref('')
let daasUrl = ref('')
let loaded = ref(false)
let viewMode = ref(ViewMode.Current)
let notificationSettings = {
  manualNotifications: false,
  useHostToastrStyles: false
}
let redirectionConfig = {
  successUrl:
    window.location.origin + '/vue/components/manage-connections?accountConnection=success',
  failureUrl:
    window.location.origin + '/vue/components/manage-connections?accountConnection=failure',
  popup: false
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
    <h2>Manage connections</h2>
    <p>This component can be used to view connected accounts, refresh consent or disconnect</p>
    <certua-ob-manage-connections
      :contentOverrides="contentOverrides"
      :daasContextToken="contextTokenOptions"
      :showTitle="false"
      :showAddButton="false"
      :daasUrl="daasUrl"
      :redirectionConfig="redirectionConfig"
      :viewMode="viewMode"
      :editAccountName="true"
      :notificationSettings="notificationSettings"
    >
    </certua-ob-manage-connections>
  </div>
  <div>
    <h4>Example code</h4>
    <pre><code>
      &lt;certua-ob-manage-connections 
        :contentOverrides="contentOverrides"
        :contextData="contextData"
        :redirectionConfig="redirectionConfig"
        :showTitle="false"
        :daasUrl="daasUrl"
        :notificationSettings="notificationSettings"
       
        :viewMode="viewMode"
        :editAccountName="true"
        :showAddButton="false"&gt;
      &lt;/certua-ob-manage-connections&gt;
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
        <tbody>
          <tr>
            <td>contentOverrides</td>
            <td>No</td>
            <td>UK Only</td>
            <td>
              This is JSON which contains any text overrides that you want to pass to the
              information screens/modals<br /><code>
                { 'certua-ob-provider-permissions': { howWeAreUsingData: ' &lt;p&gt;[Custom text
                about how you use data]&lt;/p&gt; ' }, 'certua-ob-manage-providers': {
                confirmDisconnect: { implicationOfRevocation: ' &lt;p&gt;[Custom text about
                implications of revoke]&lt;/p&gt; ', whatHappens: ' &lt;p&gt;[Custom text about what
                happens to data if they revoke]&lt;/p&gt; ', relink: ' &lt;p&gt;[Custom text about
                ability to relink]&lt;/p&gt; ', confirm: ' &lt;p&gt;[Custom text asking user to
                confirm]&lt;/p&gt; ', termsOfServiceLink: `&lt;a href="#" &gt;[Custom Link to Terms
                of service here]&lt;/a &gt;` }, disconnectSuccess: { implicationOfRevocation: '
                &lt;p&gt;[Custom text about implications of revoke]&lt;/p&gt; ', whatHappens: '
                &lt;p&gt;[Custom text about what happens to data now account are
                disconnected]&lt;/p&gt; ' } } }
              </code>
            </td>
          </tr>

          <tr>
            <td>showTitle</td>
            <td>No</td>
            <td>All</td>
            <td>
              This will show or hide the web components title (Open Banking Connected Accounts)
            </td>
          </tr>
          <tr>
            <td>showAddButton</td>
            <td>No</td>
            <td>All</td>
            <td>
              This controls if the Add Account button is shown above the currently connected
              accounts.
            </td>
          </tr>
          <tr>
            <td>editAccountName</td>
            <td>No</td>
            <td>All</td>
            <td>
              This controls if the Rename Account button is shown when managing connected accounts.
              Defaults to true unless false specified
            </td>
          </tr>
          <tr>
            <td>manualViewMode</td>
            <td>No</td>
            <td>UK Only</td>
            <td>
              This only needs to be passed in if you are in the UK region and wish to hide the
              Current/History tabs. Note in AU this is automatically set to false and cannot be
              overridden.
            </td>
          </tr>
          <tr>
            <td>viewMode</td>
            <td>No</td>
            <td>UK Only</td>
            <td>
              Only for use when 'manualViewMode' is set to true, this toggles which view mode is
              shown
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
