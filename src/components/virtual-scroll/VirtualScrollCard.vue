<script setup lang="ts">

const props = defineProps({
  item: {
    type: Object,
    default: {},
  }
})

</script>

<template>
  <div class="flex items-center gap-4">
    <img class="w-[40px] h-[40px] rounded" :src="`https://picsum.photos/id/${item?.id}/200/300`" alt="">
    <span>
      {{ item?.name }}
    </span>
  </div>
</template>