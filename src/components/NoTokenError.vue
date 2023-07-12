<script setup lang="ts">
import { add, parseISO } from 'date-fns'
import { onMounted, ref } from 'vue'

let showError = ref(false)
const emit = defineEmits(['contextTokenOptions', 'error'])
onMounted(() => {
  if (!localStorage.getItem('apiConfig')) {
    showError.value = true
    emit('error', true)
  } else {
    checkExpiry()

    emit('contextTokenOptions', JSON.parse(localStorage.getItem('apiConfig') ?? ''))
  }
})

function checkExpiry() {
  let token = JSON.parse(localStorage.getItem('apiConfig') ?? '')
  let tokenCreation = parseISO(token.dateCreated)
  if (add(tokenCreation, { minutes: 30 }) <= new Date()) {
    showError.value = true
    emit('error', true)
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
</script>

<template>
  <main>
    <div class="row" v-if="showError">
      <div class="offset-md-4 col-md-4">
        <div class="alert alert-warning" role="alert">
          You do not have a valid context token, please start again to get one.
          <RouterLink to="/">Restart</RouterLink>
        </div>
      </div>
    </div>
  </main>
</template>
