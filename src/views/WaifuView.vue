<script setup lang="ts">
import { ref } from 'vue'
import { waifuService } from '~/services'

const waifu = ref([])
const isLoading = ref(false)

const getWaifu = async () => {
  isLoading.value = true

  const { data } = await waifuService.getManyImage()
  waifu.value = data.value?.files || []

  isLoading.value = false
}
getWaifu()

</script>

<template>
  <div class="page">
    <div class="container mx-auto p-4">
      <h1 class="mb-8 text-3xl font-bold text-center">
        Waifu
      </h1>

      <div class="columns-5 gap-0" v-if="waifu?.length > 0">
        <img class="w-full h-auto" v-for="i in waifu" :key="i" :src="i" alt="">
      </div>

      <div class="text-lg text-center" v-else>
        Loading...
      </div>
    </div>
  </div>
</template>