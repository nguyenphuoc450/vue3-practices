<script setup lang="ts">
import { ref } from 'vue'

const skills = ref<string[]>([])
const suggested = ref([
  'Javascript',
  'HTML',
  'CSS',
  'ReactJS',
  'VueJS',
  'AngularJS',
  'NodeJS',
  'Typescript',
])
const choosenDrag = ref('')

const addSkillBySuggested = (skill: string) => {
  skills.value.push(skill)
  const index = suggested.value.indexOf(skill)
  suggested.value.splice(index, 1)
}

const removeSkill = (skill: string) => {
  const index = skills.value.indexOf(skill)
  skills.value.splice(index, 1)
}

const dragStart = (e: DragEvent, skill: string) => {
  console.log(e, 'start')
  const target = e?.target as HTMLElement
  setTimeout(() => {
    target.classList?.add('item--choosen')
  }, 0)
  choosenDrag.value = skill
}

const dragEnd = (e: DragEvent) => {
  console.log(e, 'end')
  const target = e?.target as HTMLElement
  target.classList?.remove('item--choosen')
  choosenDrag.value = ''
}

const dragOver = (e: DragEvent,) => {
  e.preventDefault()
  const target = e?.target as HTMLElement
}

const dragEnter = (e: DragEvent, skill: string) => {
  console.log(e, 'enter')
  const choosenIndex = skills.value.indexOf(choosenDrag.value)
  // Value before drag
  const oldValue = skill
  const dropIndex = skills.value.indexOf(oldValue)
  // Swap value choosen  drag <-> value before drag
  if (choosenIndex !== dropIndex) {
    skills.value.splice(dropIndex, 1, choosenDrag.value)
    skills.value.splice(choosenIndex, 1, oldValue)
  }
}

const dragDrop = (e: DragEvent, skill: string) => {
  e.stopPropagation();
  console.log(e, 'drop')
}

</script>

<template>
  <div class="page">
    <div class="container mx-auto p-4">
      <h1 class="mb-6 text-3xl font-bold text-[#0d2167]">
        Select your tech skill
      </h1>
      <div class="max-w-[50%] p-6 bg-white rounded" style="box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;">
        <div class="flex items-start gap-6">
          <div class="flex-1 flex flex-col gap-2">
            <div class="item p-4 flex items-center gap-4  bg-[#0d2167] rounded cursor-move transition-all"
              v-for="i in skills" :key="`skills-${i}`" draggable="true" @dragstart="(e) => { dragStart(e, i) }"
              @dragend="dragEnd" @dragover="dragOver" @dragenter="(e) => { dragEnter(e, i) }"
              @drop="(e) => { dragDrop(e, i) }">
              <span class="flex-1 text-base font-normal text-white">
                {{ i }}
              </span>
              <button class="text-base font-normal text-white" type="button" @click="removeSkill(i)">
                X
              </button>
            </div>
          </div>

          <div>
            <h3 class="mb-2 text-lg font-semibold text-[#0d2167]">
              Suggested skills
            </h3>
            <ul>
              <li class="p-2 bg-transparent rounded transition-all hover:bg-gray-100" v-for="i in suggested"
                :key="`suggested-${i}`">
                <button class="block w-full h-full text-base font-normal text-left" type="button"
                  @click="addSkillBySuggested(i)">
                  + {{ i }}
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.item--choosen {
  border: 1px dashed #0d2167;
  background-color: transparent;
}
</style>