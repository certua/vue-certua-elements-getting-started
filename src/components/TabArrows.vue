<script setup lang="ts">
import { add, parseISO } from 'date-fns'
import { onMounted, ref } from 'vue'

let showArrowLeft = ref(false)
let showArrowRight = ref(false)
defineExpose({ selectItem })
onMounted(() => {
  setTimeout(() => {
    calculateArrows()
  }, 0)
})

function navElement(): HTMLElement {
  return document.getElementById('items') as HTMLElement
}

function selectItem(i: number) {
  var navigation = navElement()
  let selectedItem = navigation.children[i] as HTMLElement
  const parentRect = navigation.getBoundingClientRect()
  const rect = selectedItem.getBoundingClientRect()

  const target = Math.round(selectedItem.offsetLeft - parentRect.width * 0.5 + rect.width * 0.5)

  scrollNavbar(target)
}

function scrollNavbar(tgt: number) {
  let navigation = navElement()
  let target = tgt

  const max = navigation.scrollWidth - navigation.clientWidth
  if (target < 0) {
    target = 0
  }
  if (target > max) {
    target = max
  }

  navigation.scrollLeft = tgt
}

function calculateArrows() {
  var navigation = navElement()
  hideAndShowArrows(navigation)
  navigation.addEventListener('scroll', (_) => {
    hideAndShowArrows(navigation)
  })
}
function hideAndShowArrows(navigation: HTMLElement) {
  if (navigation.clientWidth == 0) {
    navigation = navElement()
    setTimeout((_) => hideAndShowArrows(navigation), 100)
  } else {
    showArrowLeft.value = navigation.scrollLeft > 0
    showArrowRight.value =
      Math.abs(navigation.scrollLeft) <= navigation.scrollWidth - navigation.clientWidth - 5 //added extra 5 as this seems to sometimes never get to high enough value to hide arrow
  }
}

function moveNav(byX: number) {
  var navigation = navElement()
  navigation.scrollLeft = navigation.scrollLeft + byX
}
</script>

<template>
  <main>
    <div
      v-if="showArrowLeft"
      id="arrow-left"
      class="btn btn-xsmall-circle d-md-none border border-circle shadow-sm ms-3 mt-1"
      @click="$event.preventDefault(), $event.stopPropagation(), moveNav(-100)"
    >
      <i class="fas fa-chevron-left"></i>
    </div>
    <div
      v-if="showArrowRight"
      id="arrow-right"
      class="btn btn-xsmall-circle ms-auto d-md-none border border-circle shadow-sm me-3 mt-1"
      @click="$event.preventDefault(), $event.stopPropagation(), moveNav(100)"
    >
      <i class="fas fa-chevron-right"></i>
    </div>
  </main>
</template>
<style scoped>
.circle {
  border-radius: 100%;
  width: 44px;
  height: 44px;

  text-align: center;
  i {
    line-height: 44px;
  }
}

.fa-2x {
  font-size: 1.5em !important;
}

.header-box {
  height: 150px;
}

.out-of-box-image {
  margin-top: -35px;
}
</style>
