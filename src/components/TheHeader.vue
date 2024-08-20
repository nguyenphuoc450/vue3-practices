<script setup lang="ts">
import { ref } from 'vue'

const links = ref([
  {
    title: 'Home',
    to: '/',
  },
  {
    title: 'Waifu',
    to: '/waifu',
  },
])
const isShow = ref(false)

const toggleMenu = () => {
  isShow.value = !isShow.value
}
</script>

<template>
  <nav class="sticky top-0 bg-white border-b border-solid border-gray-200 dark:bg-gray-900 z-[100]">
    <div class="container mx-auto p-4">
      <div class="flex flex-wrap items-center justify-between">
        <RouterLink class="flex items-center space-x-3 rtl:space-x-reverse" to="/">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Vue.js_Logo_2.svg/2367px-Vue.js_Logo_2.svg.png"
            class="h-8"
            alt="Vue logo"
          />
          <span class="self-center text-2xl font-semibold whitespace-nowrap dark:text-white"> Practices </span>
        </RouterLink>
        <button
          data-collapse-toggle="navbar-default"
          type="button"
          class="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
          @click="toggleMenu"
        >
          <span class="sr-only">Open main menu</span>
          <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M1 1h15M1 7h15M1 13h15"
            />
          </svg>
        </button>
        <div class="w-full md:!block md:w-auto" v-show="isShow">
          <ul
            class="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700"
          >
            <li v-for="i in links" :key="i?.to">
              <RouterLink
                class="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 [&.active]:text-blue-700"
                :class="$route.path === i?.to && 'active'"
                :to="i?.to"
              >
                {{ i?.title }}
              </RouterLink>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </nav>
</template>
