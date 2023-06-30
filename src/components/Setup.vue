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
          <h3>Which elements would you like to integrate?</h3>
          <div class="row mt-2">
            <div class="col-md-3 offset-md-3 pointer card p-3" @click="setType('open-banking')">
              Open banking elements
            </div>
            <div
              class="col-md-3 pointer card p-3 ms-md-2 mt-2 mt-md-0"
              @click="setType('insurance')"
            >
              Insurance elements
            </div>
          </div>
        </div>
      </div>
    </div>
    <ObSetup v-if="elementType == 'open-banking'" />
    <InsuranceSetup v-if="elementType == 'insurance'" />
  </div>
</template>
