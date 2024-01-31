<script setup lang="ts">
import { RouterLink, RouterView, useRoute } from 'vue-router'
import router from './router'
import ProdWarning from './components/ProdWarning.vue'
import { onMounted, ref, watch } from 'vue'
import TabArrows from './components/TabArrows.vue'

enum SiteSection {
  Home,
  Overview,
  Components
}
let showNavigation = ref(false)
let showComponentMenu = ref(false)
let elementType = ref()
let section = ref(SiteSection.Home)
const route = useRoute()

let fullScreen = ref(false)
let tabArrows = ref()
const openBankingUrl = import.meta.env.VITE_OB_ELEMENTS_URL + '/main.js'
const openBankingPolyfillUrl = import.meta.env.VITE_OB_ELEMENTS_URL + '/polyfills.js'
const quoteAndBuyUrl = import.meta.env.VITE_QUOTE_AND_BUY_URL + '/main.js'
const quoteAndBuyPolyfillUrl = import.meta.env.VITE_QUOTE_AND_BUY_URL + '/polyfills.js'
const insuranceElementsUrl = import.meta.env.VITE_INSURANCE_ELEMENTS_URL + '/main.js'
const insuranceElementsPolyfillUrl = import.meta.env.VITE_INSURANCE_ELEMENTS_URL + '/polyfills.js'
const onboardingUrl = import.meta.env.VITE_ONBOARDING_URL + '/main.js'
const onboardingPolyfillUrl = import.meta.env.VITE_ONBOARDING_URL + '/polyfills.js'

let selectedIndex = ref(0)
let loaded = ref(false)
// do a `console.log(route)` to see route attributes (fullPath, hash, params, path...)
watch(
  () => route.fullPath,
  async () => {
    console.log('route fullPath updated', route.fullPath)
    const home = route.fullPath.includes('home')
    showNavigation.value = !home
    if (route.fullPath.includes('components')) {
      section.value = SiteSection.Components
    }
    if (route.fullPath.includes('overview')) {
      section.value = SiteSection.Overview
    }
    let page = route.fullPath.replace('/components/', '')
    if (page.includes('login?')) {
      page = page.substring(0, page.indexOf('?'))
    }

    switch (page) {
      case 'connect':
      case '/overview-insurance':
      case 'introduction':
      case 'overview': {
        selectedIndex.value = 0

        break
      }
      case 'manage-connections':
      case 'quote-and-buy': {
        selectedIndex.value = 1

        break
      }
      case 'account-summary':
      case 'claims': {
        selectedIndex.value = 2
        break
      }
      case 'transactions':
      case 'fnol': {
        selectedIndex.value = 3
        break
      }
      case 'cashflow':
      case 'quick-quote': {
        selectedIndex.value = 4
        break
      }
      case 'login': {
        selectedIndex.value = 5
        break
      }

      case 'manage-policy': {
        selectedIndex.value = 6
        break
      }
    }
    if (page.includes('view-policy')) {
      selectedIndex.value = 6
    }

    if (page.includes('quote-and-buy') && localStorage.getItem('certua-sidebar') == 'true') {
      fullScreen.value = true
    } else {
      fullScreen.value = false
    }
    let type: string = localStorage.getItem('elementType') ?? ''
    elementType.value = type
  }
)

onMounted(() => {
  let root = document.documentElement

  if (localStorage.getItem('--primary')) {
    root.style.setProperty('--primary', localStorage.getItem('--primary'))
  }
  if (localStorage.getItem('--secondary')) {
    root.style.setProperty('--secondary', localStorage.getItem('--secondary'))
  }

  let type = localStorage.getItem('elementType')
  if (type) {
    elementType.value = type
    if (type == 'open-banking') {
      loadScript(openBankingUrl, null)
      loadScript(openBankingPolyfillUrl, setLoaded)
    } else {
      loadScript(quoteAndBuyUrl, null)
      loadScript(quoteAndBuyPolyfillUrl, null)

      loadScript(insuranceElementsUrl, null)
      loadScript(insuranceElementsPolyfillUrl, null)

      loadScript(onboardingUrl, null)
      loadScript(onboardingPolyfillUrl, setLoaded)
    }
  } else {
    loaded.value = true
  }
  addEventListener('show-navigation', (event: any) => {
    showComponentMenu.value = event.detail.show
  })

  if ((type == 'insurance' && localStorage.getItem('insuranceConfig')) || type == 'open-banking') {
    showComponentMenu.value = true
  }
})

function clearType() {
  elementType.value = undefined
  localStorage.removeItem('elementType')
  router.push('/home')
}

function selectItem(i: number, route: string, section?: string) {
  tabArrows.value.selectItem(i)
  selectedIndex.value = i
  if (!section) {
    router.replace(route)
  } else {
    router.replace({ path: route, hash: `#${section}` })
  }
  // select.emit(item);
}

function backToGettingStarted() {
  fullScreen.value = false
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
    <div class="row bg-grey border-bottom" id="header" v-if="!fullScreen">
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
                <li class="nav-item" v-if="elementType == 'open-banking'">
                  <RouterLink :to="'/home'" class="nav-link">Home</RouterLink>
                </li>
                <li class="nav-item" v-if="elementType == 'insurance'">
                  <a :href="'/vue/overview-insurance'" class="nav-link">Overview</a>
                </li>
                <li class="nav-item" v-if="!!elementType && !!showComponentMenu">
                  <RouterLink :to="'/components'" class="nav-link">Components</RouterLink>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </div>
    </div>
    <div class="row" id="sidebar" v-if="!fullScreen">
      <div class="col-md-3 border-end" id="side" v-if="showNavigation">
        <TabArrows class="mt-4 d-md-none" ref="tabArrows" />
        <div class="stay-put">
          <div
            class="list-group mt-4 d-flex flex-md-column flex-row overflow-auto mx-1"
            v-if="elementType == 'insurance' && section == SiteSection.Overview"
            id="items"
          >
            <span
              :class="{ active: selectedIndex == 0 }"
              @click="selectItem(0, '/overview-insurance', 'introduction')"
              class="list-group-item pointer"
              >Introduction</span
            >
            <span
              :class="{ active: selectedIndex == 1 }"
              @click="selectItem(1, '/overview-insurance', 'getting-started')"
              class="list-group-item pointer"
              >Getting started</span
            >
            <span
              :class="{ active: selectedIndex == 2 }"
              @click="selectItem(2, '/overview-insurance', 'site-code')"
              class="list-group-item pointer"
              >Site Code</span
            >
            <span
              :class="{ active: selectedIndex == 3 }"
              @click="selectItem(3, '/overview-insurance', 'client-libraries')"
              class="list-group-item pointer"
              >Client Libraries</span
            >
            <span
              :class="{ active: selectedIndex == 4 }"
              @click="selectItem(4, '/overview-insurance', 'using-components')"
              class="list-group-item pointer"
              >Using Components</span
            >
          </div>
          <div
            class="list-group mt-4 d-flex flex-md-column flex-row overflow-auto mx-1"
            v-if="elementType == 'open-banking' && section == SiteSection.Components"
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
            v-if="elementType == 'insurance' && section == SiteSection.Components"
          >
            <span
              :class="{ active: selectedIndex == 0 }"
              @click="selectItem(0, '/components/introduction')"
              class="list-group-item pointer"
              >Introduction</span
            >
            <span
              :class="{ active: selectedIndex == 1 }"
              @click="selectItem(1, '/components/quote-and-buy')"
              class="list-group-item pointer"
              >Quote and buy</span
            >
            <span
              :class="{ active: selectedIndex == 2 }"
              @click="selectItem(2, '/components/claims')"
              class="list-group-item pointer"
              >Claims</span
            >
            <span
              :class="{ active: selectedIndex == 3 }"
              @click="selectItem(3, '/components/fnol')"
              class="list-group-item pointer"
              >Fnol</span
            >
            <span
              :class="{ active: selectedIndex == 4 }"
              @click="selectItem(4, '/components/quick-quote')"
              class="list-group-item pointer"
              >Quick Quote</span
            >

            <span
              :class="{ active: selectedIndex == 5 }"
              @click="selectItem(5, '/components/login')"
              class="list-group-item pointer"
              >Login</span
            >
            <span
              :class="{ active: selectedIndex == 6 }"
              @click="selectItem(6, '/components/manage-policy')"
              class="list-group-item pointer"
              >View Policy</span
            >
            <span
              :class="{ active: selectedIndex == 7 }"
              @click="selectItem(7, '/components/quotes-list')"
              class="list-group-item pointer"
              >Quotes List</span
            >
            <span
              :class="{ active: selectedIndex == 8 }"
              @click="selectItem(8, '/components/documents')"
              class="list-group-item pointer"
              >Documents</span
            >
          </div>
        </div>
        <nav></nav>
      </div>
      <div class="col mt-4" id="content" v-if="loaded">
        <ProdWarning /><RouterView :key="$route.fullPath" />
      </div>
    </div>
    <div v-if="fullScreen" id="full-header" class="row mx-0 nav-main bg-white dl-nav-main">
      <div class="d-flex flex-row w-100 align-items-center">
        <div class="col-md-2 text-start">
          <button class="btn btn-link pointer" @click="backToGettingStarted()">
            <i class="fal fa-long-arrow-left me-2"></i>Exit fullscreen
          </button>
        </div>
      </div>
    </div>
    <div v-if="fullScreen"><ProdWarning /><RouterView :key="$route.fullPath" /></div>
  </div>
</template>

<style scoped>
#full-header,
#header {
  width: 100%;
  background-color: #fff;
  position: -webkit-sticky;
  position: fixed;
  top: 0;
  z-index: 1000;
}

#side {
  margin-top: 4rem;
  background-color: white;
  padding-bottom: 10px;
  z-index: 999;
}

#header {
  font-size: 15px;
  font-weight: 700;
}

#content {
  margin-top: 100px !important;
}

#header .router-link-active {
  color: #007fc6 !important;
}

#sidebar {
  height: 95vh;
  font-size: 14px;
}

#items {
  margin-top: 6rem;
  z-index: 490;
}

.stay-put {
  position: sticky;
  top: 100px;
  z-index: 490;
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
  background-color: #f4f5f7 !important;
}
</style>
