<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import VirtualScrollCard from './VirtualScrollCard.vue'

const contentContainer = ref()
const contentHeight = ref(0)
const viewPortHeight = ref(400)
const itemHeight = ref(56) // height 40 + 16 gap
const dummyData = ref<any>([])
const visibleItems = ref<any>([])
const offsetY = ref(0)

const getDummyData = () => {
  dummyData.value = new Array(10000)?.fill(null)?.map((_: null, index: number) => ({ id: index, name: 'Lorem ' + index }))
  contentHeight.value = dummyData.value.length * itemHeight.value
  const totalVisible = Math.ceil(viewPortHeight.value / itemHeight.value)
  visibleItems.value = dummyData.value.slice(0, totalVisible)
}
getDummyData()

const handleScroll = (e: Event) => {
  const scrollTop = (e.target as HTMLElement)?.scrollTop
  const nodePadding = 4

  const startNode = Math.max(0, Math.floor(scrollTop / itemHeight.value) - nodePadding)
  const totalVisible = Math.ceil(viewPortHeight.value / itemHeight.value + 2 * nodePadding)

  offsetY.value = startNode * itemHeight.value
  const newData = dummyData.value.slice(startNode, startNode + totalVisible)

  visibleItems.value = newData.map((item: any, index: number) => ({
    id: startNode + index,
    name: 'Lorem ' + Number(startNode + index)
  }))
}

onMounted(() => {
  contentContainer.value.addEventListener('scroll', handleScroll)
})

onBeforeUnmount(() => {
  contentContainer.value.removeEventListener('scroll', handleScroll)
})

</script>

<template>
  <div>
    <h2 class="mb-4 text-xl font-bold">
      Virutal Scroll Basic
    </h2>

    <div class="overflow-auto" ref="contentContainer" :style="{ height: viewPortHeight + 'px' }">
      <div class="overflow-hidden" :style="{ height: contentHeight + 'px' }">
        <div class="flex flex-col gap-4" :style="{ transform: ` translateY(${offsetY}px)` }">
          <VirtualScrollCard v-for="i in visibleItems" :key="i?.id" :item="i" />
        </div>
      </div>
    </div>
  </div>
</template>