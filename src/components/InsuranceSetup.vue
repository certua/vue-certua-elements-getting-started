<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { from, map, tap, catchError } from 'rxjs'
import axios, { formToJSON } from 'axios'

import router from '@/router'
import { parseISO, add } from 'date-fns'
enum Step {
  ReferrerCode,
  Success,
  Error
}
// reactive state

let referrerCode = ref('')

let demoSiteCode = import.meta.env.VITE_DEMO_SITE_CODE
let demoSidebarSiteCode = import.meta.env.VITE_DEMO_SIDEBAR_CODE

const step = ref(Step.ReferrerCode)

// functions that mutate state and trigger updates##

function reset() {
  step.value = Step.ReferrerCode
}

function back(chosenStep: Step) {
  step.value = chosenStep
}

function goToComponents() {
  router.replace('/components/quote-and-buy')
}

function setReferrer(value?: string) {
  step.value = Step.Success
  if (!!value) {
    referrerCode.value = value
  }

  localStorage.setItem(
    'insuranceConfig',
    JSON.stringify({
      referrerId: referrerCode.value,
      basePath: 'vue/components/quote-and-buy'
    })
  )
}

function startAgain() {
  localStorage.clear()
  router.replace('/components/connect')
}

// lifecycle hooks
onMounted(() => {
  // if (localStorage.getItem('apiConfig')) {
  //   checkExpiry()
  // }
})
</script>

<template>
  <div class="row">
    <div class="col-md-6 offset-md-3 text-center">
      <h3>Insurance Elements</h3>
      <!-- Start INS Setup Steps -->

      <div class="row" v-if="step == Step.ReferrerCode">
        <div class="col">
          <h3>Firstly, we need your site code</h3>
          <div class="text-start">
            <label for="referrerId" class="form-label">Site Code</label>
            <input id="referrerId" type="text" class="form-control" v-model="referrerCode" />

            <button class="btn btn-primary mt-2" @click="setReferrer()">Set site code</button>
            <button class="btn btn-secondary mt-2 ms-2" @click="setReferrer(demoSiteCode)">
              Use demo site
            </button>
            <button class="btn btn-secondary mt-2 ms-2" @click="setReferrer(demoSidebarSiteCode)">
              Use sidebar demo site
            </button>
          </div>
        </div>
      </div>

      <div class="row" v-if="step == Step.Success">
        <div class="col">
          <h3>Success you can now start using Insurance elements</h3>
          <button class="btn btn-link" @click="goToComponents()">Go to components</button>
          <button class="btn btn-secondary mt-2 ms-2" @click="startAgain()">Start again</button>
        </div>
      </div>
      <div class="row" v-if="step == Step.Error">
        <div class="col">
          <h3>Something went wrong. Please try again</h3>
          <button class="btn btn-primary mt-3" @click="reset()">Try again</button>
        </div>
      </div>
    </div>
  </div>
</template>
