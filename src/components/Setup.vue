<script setup lang="ts">
import { ref, onMounted } from 'vue'

import Welcome from './Welcome.vue'

import ObSetup from './ObSetup.vue'
import InsuranceSetup from './InsuranceSetup.vue'

// reactive state

const elementType = ref('')

// functions that mutate state and trigger updates##

function setType(type: string) {
  localStorage.setItem('elementType', type)
  elementType.value = type
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
            <div class="col-md-3 pointer card p-3 ms-2" @click="setType('insurance')">
              Insurance elements
            </div>
          </div>
        </div>
      </div>
    </div>
    <ObSetup v-if="elementType == 'open-banking'" />
    <InsuranceSetup v-if="elementType == 'insurance'" />

    <div class="btn btn-link" v-if="elementType == 'insurance'" @click="setType('open-banking')">
      Switch to Open Banking Elements
    </div>
    <div class="btn btn-link" v-if="elementType == 'open-banking'" @click="setType('insurance')">
      Switch to Insurance Elements
    </div>
  </div>
</template>
