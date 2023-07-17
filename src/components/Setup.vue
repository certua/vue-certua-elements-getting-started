<script setup lang="ts">
import { ref, onMounted } from 'vue'

import Welcome from './Welcome.vue'

import ObSetup from './ObSetup.vue'
import InsuranceSetup from './InsuranceSetup.vue'

// reactive state

const elementType = ref('')
const openBankingUrl = import.meta.env.VITE_OB_ELEMENTS_URL + '/main.js'
const openBankingPolyfillUrl = import.meta.env.VITE_OB_ELEMENTS_URL + '/polyfills.js'
const quoteAndBuyUrl = import.meta.env.VITE_QUOTE_AND_BUY_URL + '/main.js'
const quoteAndBuyPolyfillUrl = import.meta.env.VITE_QUOTE_AND_BUY_URL + '/polyfills.js'
const insuranceElementsUrl = import.meta.env.VITE_INSURANCE_ELEMENTS_URL + '/main.js'
const insuranceElementsPolyfillUrl = import.meta.env.VITE_INSURANCE_ELEMENTS_URL + '/polyfills.js'
const onboardingUrl = import.meta.env.VITE_ONBOARDING_URL + '/main.js'
const onboardingPolyfillUrl = import.meta.env.VITE_ONBOARDING_URL + '/polyfills.js'
// functions that mutate state and trigger updates##

function setType(type: string) {
  localStorage.setItem('elementType', type)
  elementType.value = type
  if (type == 'open-banking') {
    loadScript(openBankingUrl, null)
    loadScript(openBankingPolyfillUrl, null)
  } else {
    loadScript(quoteAndBuyUrl, null)
    loadScript(quoteAndBuyPolyfillUrl, null)

    loadScript(insuranceElementsUrl, null)
    loadScript(insuranceElementsPolyfillUrl, null)

    loadScript(onboardingUrl, null)
    loadScript(onboardingPolyfillUrl, null)
  }
}

function loadScript(url: string, onload: any) {
  const componentJS = document.createElement('script')
  componentJS.async = true
  componentJS.defer = true
  componentJS.src = url
  componentJS.type = 'module'
  //componentJS.src = url + `?v=${this._initialCacheDate.toString()}`;
  componentJS.onload = onload
  document.head.appendChild(componentJS)
}

// lifecycle hooks
onMounted(() => {
  let type = localStorage.getItem('elementType')
  if (!!type) {
    elementType.value = type
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
      <div class="row" v-if="!elementType">
        <div class="col">
          <h3 class="subtitle">Which elements would you like to integrate?</h3>
          <div class="row mt-4">
            <div
              class="col-md-3 offset-md-3 pointer shadow p-3 element-box"
              @click="setType('open-banking')"
            >
              <i class="fa-solid fa-building-columns fa-2xl circle-icon"></i>
              <p class="text-uppercase font-weight-bold mt-4">Open banking</p>
            </div>
            <div
              v-if="false"
              class="col-md-3 pointer shadow p-3 ms-md-2 mt-2 mt-md-0 element-box"
              @click="setType('insurance')"
            >
              <i class="fa -solid fa-shield-halved fa-2xl circle-icon"></i>
              <p class="text-uppercase font-weight-bold mt-4">Insurance</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <ObSetup v-if="elementType == 'open-banking'" />
    <InsuranceSetup v-if="elementType == 'insurance'" />
  </div>
</template>
<style scoped>
.element-box {
  height: 150px;
}

.font-weight-bold {
  font-weight: 700;
  color: #000;
}

i {
  color: #007fc6 !important;
}

.subtitle {
  font-size: 24px;
}

.circle-icon {
  background: #e5f6ff;

  justify-content: center;
  align-items: center;
  border-radius: 100%;
  text-align: center;
  margin: 5px 0 0 0;
  display: flex;
  padding: 3px;
  height: 60px;
  width: 60px;
  margin-left: auto;
  margin-right: auto;
}
</style>
