<script setup lang="ts">
import VirtualScrollBasic from '~/components/virtual-scroll/VirtualScrollBasic.vue'

</script>

<template>
  <div class="page">
    <div class="container mx-auto p-4">
      <ul class="list-disc">
        <li>
          <RouterLink class="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0
               md:hover:text-blue-700 md:p-0" to="/virtual-scroll">
            Virtual Scroll
          </RouterLink>
        </li>
      </ul>
    </div>
  </div>
</template>
