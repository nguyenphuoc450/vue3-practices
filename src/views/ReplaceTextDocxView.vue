<script setup lang="ts">
import mammoth from 'mammoth'
import { ref } from 'vue'

const inputFile = ref()
const find = ref({
  text: '',
  total: 0,
  current: 0,
})
const textReplace = ref('')
const contentFile = ref('')

const transformElement = (element: any) => {
  if (element.children) {
    var children = element.children.map(transformElement)
    element = { ...element, children: children }
  }

  if (element.type === 'paragraph') {
    element = transformParagraph(element)
  }

  return element
}

const transformParagraph = (element: any) => {
  if (element.alignment === 'center' && !element.styleId) {
    return { ...element, styleName: 'center-aligned' }
  } else if (element.alignment === 'right' && !element.styleId) {
    return { ...element, styleName: 'right-aligned' }
  } else if (element.alignment === 'left' && !element.styleId) {
    return { ...element, styleName: 'left-aligned' }
  } else {
    return element
  }
}

const resetValue = () => {
  find.value = {
    text: '',
    total: 0,
    current: 0,
  }
  textReplace.value = ''
  contentFile.value = ''
}

const changeFile = (event: Event) => {
  resetValue()

  const files = (event.target as HTMLInputElement).files
  const file = files && files?.length > 0 ? files[0] : null

  if (file) {
    console.log('uploaded', file)

    const reader = new FileReader()

    reader.onload = async (e: any) => {
      // Lấy ArrayBuffer từ kết quả
      const arrayBuffer = e.target.result
      const value = {
        arrayBuffer,
      }
      const options = {
        includeEmbeddedStyleMap: true,
        transformDocument: transformElement,
        styleMap: [
          'u => u',
          'table => table.w-full',
          "p[style-name='left-aligned'] => p.text-left",
          "p[style-name='center-aligned'] => p.text-center",
          "p[style-name='right-aligned'] => p.text-right",
        ],
      }

      const result = await mammoth.convertToHtml(value, options)

      contentFile.value = result?.value || ''
      console.log(result)
    }

    reader.readAsArrayBuffer(file)
  }
}

const handleFindText = async () => {
  const contentElement = document.getElementById('content-docx')

  if (contentElement) {
    contentElement.innerHTML = contentFile.value // Reset mark

    const html = contentElement?.innerHTML
    let re = new RegExp(find.value.text, 'g') // search for all instances

    let newHtml = html.replace(re, `<mark>${find.value.text}</mark>`)
    contentElement.innerHTML = newHtml

    const markElements = document.querySelectorAll('mark')
    find.value.total = markElements?.length
  }
}

const previousTextFind = () => {
  const markElements = document.querySelectorAll('mark')

  const number = find.value.current >= 1 ? find.value.current - 1 : find.value.current
  find.value.current = number

  const scrollTo = markElements[number - 1]?.offsetTop
  window?.scrollTo({
    top: scrollTo,
    behavior: 'smooth',
  })
}
const nextTextFind = () => {
  const markElements = document.querySelectorAll('mark')

  const number = find.value.current < find.value.total ? find.value.current + 1 : find.value.current
  find.value.current = number

  const scrollTo = markElements[number - 1]?.offsetTop
  window?.scrollTo({
    top: scrollTo,
    behavior: 'smooth',
  })
}

const handleReplace = async () => {
  const contentElement = document.getElementById('content-docx')

  if (contentElement) {
    const html = contentElement?.innerHTML
    let re = new RegExp(find.value.text, 'g') // search for all instances

    let newHtml = html.replace(re, `<mark>${textReplace.value}</mark>`)
    contentElement.innerHTML = newHtml
  }
}

const downloadFile = () => {
  console.log('download')
  // const contentElement = document.getElementById('content-docx')

  // if (contentElement) {
  //   const html = contentElement?.innerHTML
  //   let re = new RegExp(`<mark>${textReplace.value}</mark>`, 'g') // search for all instances

  //   let newHtml = html.replace(re, textReplace.value)
  //   contentElement.innerHTML = newHtml
  // }
}
</script>

<template>
  <div class="p-1 lg:p-4 bg-[#f0f3f5]">
    <input class="mb-2 p-2" type="file" placeholder="Upload here" accept=".docx" ref="inputFile" @change="changeFile" />

    <div class="mb-2 flex gap-4">
      <input class="p-2" type="text" placeholder="Find text" v-model="find.text" />
      <button class="p-1 bg-white border border-solid rounded" type="button" @click="handleFindText"> Find </button>
      <div class="flex items-center gap-2">
        <button
          class="p-1 bg-white border border-solid rounded"
          type="button"
          :disabled="find.current <= 1"
          @click="previousTextFind"
        >
          Prev
        </button>
        <span> {{ find.current }} / {{ find.total }} </span>
        <button
          class="p-1 bg-white border border-solid rounded"
          type="button"
          :disabled="find.current >= find.total"
          @click="nextTextFind"
        >
          Next
        </button>
      </div>
    </div>

    <div class="mb-2 flex gap-4">
      <input class="p-2" type="text" placeholder="Text replace" v-model="textReplace" />
      <button
        class="p-1 bg-white border border-solid rounded"
        :disabled="find.text?.length <= 0"
        @click="handleReplace"
      >
        Replace file
      </button>
    </div>

    <div class="mb-2">
      <!-- <a id="downloadLink" href=""> Download </a> -->
      <button class="p-1 bg-white border border-solid rounded" type="button" @click="downloadFile"> Download </button>
    </div>

    <div id="content-docx" class="p-2 bg-white border border-solid border-[#eeeef0]" v-html="contentFile"> </div>
  </div>
</template>
