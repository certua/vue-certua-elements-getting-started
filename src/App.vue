<script setup lang="ts">
import { RouterLink, RouterView, useRoute } from 'vue-router'
import router from './router'
import Setup from './components/Setup.vue'
import { onMounted, ref, watch } from 'vue'

let showNavigation = ref(false)
let elementType = ref()
const route = useRoute()

// do a `console.log(route)` to see route attributes (fullPath, hash, params, path...)
watch(
  () => route.fullPath,
  async () => {
    console.log('route fullPath updated', route.fullPath)
    const home = route.fullPath.includes('home')
    showNavigation.value = !home

    let type: string = localStorage.getItem('elementType') ?? ''
    elementType.value = type
  }
)

onMounted(() => {
  let root = document.documentElement

  if (!!localStorage.getItem('--primary')) {
    root.style.setProperty('--primary', localStorage.getItem('--primary'))
  }
  if (!!localStorage.getItem('--secondary')) {
    root.style.setProperty('--secondary', localStorage.getItem('--secondary'))
  }
})

function setType(type: string) {
  elementType.value = type
  localStorage.setItem('elementType', type)
  router.push('/home')
}
</script>

<template>
  <div class="container-fluid">
    <div class="row bg-grey border-bottom" id="header">
      <div class="col">
        <nav class="navbar navbar-expand-lg bg-body-tertiary">
          <a class="navbar-brand" href="/">
            <div class="d-flex justify-items-center">
              <img src="./assets/certua.png" /></div
          ></a>
          <div class="collapse navbar-collapse">
            <ul class="navbar-nav me-auto">
              <li class="nav-item">
                <RouterLink :to="'/home'" class="nav-link">Home</RouterLink>
              </li>
              <li class="nav-item" v-if="!!elementType">
                <RouterLink :to="'/components'" class="nav-link">Components</RouterLink>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    </div>
    <div class="row" id="sidebar">
      <div class="col-md-3 border-end" v-if="showNavigation">
        <div class="list-group mt-4" v-if="elementType == 'open-banking'">
          <p>Open Banking Components</p>
          <RouterLink to="/components/connect" class="list-group-item">Connect</RouterLink>
          <RouterLink to="/components/manage-connections" class="list-group-item"
            >Manage Connections</RouterLink
          >
          <RouterLink to="/components/account-summary" class="list-group-item"
            >Account Summary</RouterLink
          >
          <RouterLink to="/components/transactions" class="list-group-item"
            >Transactions</RouterLink
          >
          <RouterLink to="/components/cashflow" class="list-group-item">Cashflow</RouterLink>
          <div class="btn btn-link" @click="setType('insurance')">Switch to Insurance elements</div>
        </div>
        <div class="list-group mt-4" v-if="elementType == 'insurance'">
          <p>Insurance Components</p>
          <!-- <RouterLink to="/components/connect" class="list-group-item">Connect</RouterLink>
          <RouterLink to="/components/manage-connections" class="list-group-item"
            >Manage Connections</RouterLink
          >
          <RouterLink to="/components/account-summary" class="list-group-item"
            >Account Summary</RouterLink
          >
          <RouterLink to="/components/transactions" class="list-group-item"
            >Transactions</RouterLink
          >
          <RouterLink to="/components/cashflow" class="list-group-item">Cashflow</RouterLink> -->
          <div class="btn btn-link" @click="setType('open-banking')">
            Switch to Open banking elements
          </div>
        </div>
        <nav></nav>
      </div>
      <div class="col mt-4"><RouterView /></div>
    </div>
  </div>
</template>

<style scoped>
#header {
  height: 5vh;
  font-size: 15px;
  font-weight: 700;
}

#header .router-link-active {
  color: #007fc6 !important;
}

#sidebar {
  height: 95vh;
  font-size: 14px;
}

#sidebar .list-group-item {
  border: none !important;
  border-radius: 2px !important;
  font-weight: 700 !important;
}

#sidebar .list-group-item:hover {
  color: #007fc6 !important;
}
#sidebar .router-link-active {
  background: #007fc626 !important;
  color: #007fc6;
}

.bg-grey {
  background-color: #f4f5f7;
}
</style>
