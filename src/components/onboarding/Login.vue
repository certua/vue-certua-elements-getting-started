<script setup lang="ts">
import { ref, onMounted, onBeforeMount } from 'vue'
import router from '@/router'

let showError = ref(false)
let config = ref({})
let loaded = ref(false)
let loginSuccess = ref(false)

onBeforeMount(() => {
  let configJson = localStorage.getItem('insuranceConfig')

  if (configJson) {
    config.value = JSON.parse(configJson)
  }
})

onMounted(() => {
  if (localStorage.getItem('elementType') !== 'insurance') {
    router.replace('/components/connect')
  }

  loaded.value = true
})

function setLoginSuccess(value) {
  loginSuccess.value = value
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
      This component allows you to login to the Certua Insurance platform and then access the other
      components including View Policy. You will need to pass in what the component is to display
      for the login and logout buttons.
    </p>
    <certua-insurance-login
      :referrerSiteCode="config?.referrerId"
      :loginUrl="'http://localhost:5173/vue/components/login'"
      :logoutUrl:="'http://localhost:5173/vue/components/login'"
      :coversUrl:="'http://localhost:5173/vue/components/view-policy2'"
      @loginSuccess="setLoginSuccess($event)"
    >
      <button class="btn btn-primary" login>Login</button>
      <button class="btn btn-secondary btn-circle" logout>Logout</button>
    </certua-insurance-login>
  </div>

  <p></p>
  <h4>Example code</h4>

  <code>
    <pre>
    &lt;certua-insurance-login
    :referrerSiteCode="config.referrerId"
    :coversUrl="'http://localhost:4200/vue/components/view-policy2'"
    :loginUrl="'http://localhost:4200/vue/components/view-policy2'"
    :logoutUrl="'http://localhost:4200/vue/components/login'"&gt;

    &lt;button class="btn btn-primary" login&gt;Login&lt;/button&gt;
    &lt;button class="btn btn-secondary btn-circle" logout&gt;&lt;i class="fa fa-user"&gt;&lt;/button&gt;

    &lt;/certua-insurance-login&gt;
        </pre
    >
  </code>
  <h4>Input Elements</h4>
  <p></p>
  <h4>Component specific inputs</h4>
  <div class="table-responsive">
    <table class="table">
      <thead>
        <th>Property Name</th>
        <th>Mandatory</th>
        <th>Description</th>
      </thead>
      <tbody>
        <tr>
          <td>
            <code>loginUrl</code>
          </td>
          <td>Yes</td>
          <td>
            This is the url that the user will be redirected to after a successful login. This page
            would usually host the View Policy component.
          </td>
        </tr>

        <tr>
          <td>
            <code>logoutUrl</code>
          </td>
          <td>Yes</td>
          <td>This is the url that the user will be redirected to after a successful logout.</td>
        </tr>

        <tr>
          <td>
            <code>coversUrl</code>
          </td>
          <td>Yes</td>
          <td>
            This is the url that the user will be taken to when they choose the My Covers option
            from the logged in menu. This page would usually host the View Policy component.
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
