<script setup lang="ts">
import { RouterLink, RouterView, useRoute } from 'vue-router'
import router from './router'
import ProdWarning from './components/ProdWarning.vue'
import { onMounted, ref, watch } from 'vue'
import TabArrows from './components/TabArrows.vue'
let showNavigation = ref(false)
let elementType = ref()
const route = useRoute()

let tabArrows = ref()
const openBankingUrl = import.meta.env.VITE_OB_ELEMENTS_URL + '/main.js'
const openBankingPolyfillUrl = import.meta.env.VITE_OB_ELEMENTS_URL + '/polyfills.js'
const quoteAndBuyUrl = import.meta.env.VITE_QUOTE_AND_BUY_URL + '/main.js'
const quoteAndBuyPolyfillUrl = import.meta.env.VITE_QUOTE_AND_BUY_URL + '/polyfills.js'
const insuranceElementsUrl = import.meta.env.VITE_INSURANCE_ELEMENTS_URL + '/main.js'
const insuranceElementsPolyfillUrl = import.meta.env.VITE_INSURANCE_ELEMENTS_URL + '/polyfills.js'
let selectedIndex = ref(0)
let loaded = ref(false)
// do a `console.log(route)` to see route attributes (fullPath, hash, params, path...)
watch(
  () => route.fullPath,
  async () => {
    console.log('route fullPath updated', route.fullPath)
    const home = route.fullPath.includes('home')
    showNavigation.value = !home

    let page = route.fullPath.replace('/components/', '')
    switch (page) {
      case 'connect':
      case 'quote-and-buy': {
        selectedIndex.value = 0
        break
      }
      case 'manage-connections':
      case 'claims': {
        selectedIndex.value = 1
        break
      }
      case 'account-summary':
      case 'fnol': {
        selectedIndex.value = 2
        break
      }
      case 'transactions': {
        selectedIndex.value = 3
        break
      }
      case 'cashflow': {
        selectedIndex.value = 4
        break
      }
    }
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

  let type = localStorage.getItem('elementType')
  if (!!type) {
    elementType.value = type
    if (type == 'open-banking') {
      loadScript(openBankingUrl, null)
      loadScript(openBankingPolyfillUrl, setLoaded)
    } else {
      loadScript(quoteAndBuyUrl, null)
      loadScript(quoteAndBuyPolyfillUrl, null)

      loadScript(insuranceElementsUrl, null)
      loadScript(insuranceElementsPolyfillUrl, setLoaded)
    }
  } else {
    loaded.value = true
  }
})

function clearType() {
  elementType.value = undefined
  localStorage.removeItem('elementType')
  router.push('/home')
}

function selectItem(i: number, route: string) {
  router.replace(route)
  tabArrows.value.selectItem(i)
  selectedIndex.value = i
  // select.emit(item);
}

function setLoaded() {
  loaded.value = true
}
function loadScript(url: string, onload: any) {
  const componentJS = document.createElement('script')

  componentJS.src = url
  componentJS.type = 'module'
  //componentJS.src = url + `?v=${this._initialCacheDate.toString()}`;
  componentJS.onload = onload
  document.head.appendChild(componentJS)
}
</script>

<template>
  <div class="container-fluid">
    <div class="row bg-grey border-bottom" id="header">
      <div class="col px-0">
        <nav class="navbar navbar-expand-lg bg-body-tertiary">
          <div class="container-fluid">
            <a class="navbar-brand" href="/">
              <div class="d-flex justify-items-center">
                <img @click="clearType()" src="./assets/certua.png" /></div
            ></a>
            <button
              class="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarSupportedContent">
              <ul class="navbar-nav me-auto">
                <li class="nav-item">
                  <RouterLink :to="'/home'" class="nav-link">Home</RouterLink>
                </li>
                <li class="nav-item" v-if="!!elementType">
                  <RouterLink :to="'/components'" class="nav-link">Components</RouterLink>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </div>
    </div>
    <div class="row" id="sidebar">
      <div class="col-md-3 border-end" v-if="showNavigation">
        <TabArrows class="mt-4 d-md-none" ref="tabArrows" />

        <div
          class="list-group mt-4 d-flex flex-md-column flex-row overflow-auto mx-1"
          v-if="elementType == 'open-banking'"
          id="items"
        >
          <span
            :class="{ active: selectedIndex == 0 }"
            @click="selectItem(0, '/components/connect')"
            class="list-group-item pointer"
            >Connect</span
          >
          <span
            :class="{ active: selectedIndex == 1 }"
            @click="selectItem(1, '/components/manage-connections')"
            class="list-group-item pointer"
            >Manage Connections</span
          >
          <span
            :class="{ active: selectedIndex == 2 }"
            @click="selectItem(2, '/components/account-summary')"
            class="list-group-item pointer"
            >Account Summary</span
          >
          <span
            :class="{ active: selectedIndex == 3 }"
            @click="selectItem(3, '/components/transactions')"
            class="list-group-item pointer"
            >Transactions</span
          >
          <span
            :class="{ active: selectedIndex == 4 }"
            @click="selectItem(4, '/components/cashflow')"
            class="list-group-item pointer"
            >Cashflow</span
          >
        </div>
        <div
          class="list-group mt-4 d-flex flex-md-column flex-row overflow-auto mx-1"
          id="items"
          v-if="elementType == 'insurance'"
        >
          <span
            :class="{ active: selectedIndex == 0 }"
            @click="selectItem(0, '/components/quote-and-buy')"
            class="list-group-item pointer"
            >Quote and buy</span
          >
          <span
            :class="{ active: selectedIndex == 1 }"
            @click="selectItem(1, '/components/claims')"
            class="list-group-item pointer"
            >Claims</span
          >
          <span
            :class="{ active: selectedIndex == 2 }"
            @click="selectItem(2, '/components/fnol')"
            class="list-group-item pointer"
            >Fnol</span
          >
        </div>
        <nav></nav>
      </div>
      <div class="col mt-4" v-if="loaded"><ProdWarning /><RouterView /></div>
    </div>
  </div>
</template>

<style scoped>
#header {
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
  white-space: nowrap;
}

#sidebar .list-group-item:hover {
  color: #007fc6 !important;
}
#sidebar .active {
  background: #007fc626 !important;
  color: #007fc6;
}

.bg-grey {
  background-color: #f4f5f7;
}
</style>
