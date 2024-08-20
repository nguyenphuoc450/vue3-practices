<script setup lang="ts">
import { ref } from 'vue'

const practices = ref([
  {
    title: 'Virutal scroll',
    to: '/virtual-scroll',
  },
  {
    title: 'List sortable (drap drop)',
    to: '/list-sortable',
  },
  {
    title: 'Pdf handle',
    to: '/pdf-handle',
  },
  {
    title: 'Replace text from file docx',
    to: '/replace-text-docx',
  },
])
</script>

<template>
  <div class="page">
    <div class="container mx-auto p-4">
      <ul class="pl-6 list-disc">
        <li v-for="i in practices" :key="i?.to">
          <RouterLink
            class="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0"
            :to="i?.to"
          >
            {{ i?.title }}
          </RouterLink>
        </li>
      </ul>
    </div>
  </div>
</template>
