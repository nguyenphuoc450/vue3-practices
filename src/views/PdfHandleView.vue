<script setup lang="ts">
import * as PDFJS from 'pdfjs-dist'
import { jsPDF } from 'jspdf'
import html2canvas from 'html2canvas'
import { ref } from 'vue'

const ID_PDF_VIEWER = 'pdf-viewer'
const Class_ITEM_PAGE_PDF = 'pdf-page-canvas'

// // The workerSrc property shall be specified.
PDFJS.GlobalWorkerOptions.workerSrc = PDFJS.GlobalWorkerOptions.workerSrc =
	new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString()

const inputFile = ref<HTMLInputElement>()

const onChangeFile = (e: Event) => {
	const files = (e.target as HTMLInputElement).files

	if (files && files?.length > 0) {
		const file = files[0]
		const fileReader = new FileReader()

		fileReader.onload = (evt: any) => {
			const typeTypedArray = new Uint8Array(evt.target?.result)

			// Remove old items
			const items = document.getElementsByClassName(Class_ITEM_PAGE_PDF)
			const cloneItems = Array.from(items)
			for (let item of cloneItems) {
				item?.remove()
			}
			// create new canvas
			handleViewPDF(typeTypedArray)
		}
		fileReader.readAsArrayBuffer(file)
	}

	// Reset value file
	if (inputFile.value) {
		inputFile.value.value = ''
	}
}

const imageBase64ToFileObject = async (b64img: string) => {
	const nameFile = `${new Date().getTime()}.png`
	const mimeType = base64MimeType(b64img)

	const file = await urltoFile(b64img, nameFile, mimeType)
	console.log('file', file)
}

//return a promise that resolves with a File instance
const urltoFile = async (url: string, filename: string, mimeType: any) => {
	return fetch(url)
		.then(function (res) {
			return res.arrayBuffer()
		})
		.then(function (buf) {
			return new File([buf], filename, { type: mimeType })
		})
}

//return mime Type of bs64
const base64MimeType = (encoded: any) => {
	var result = null

	if (typeof encoded !== 'string') {
		return result
	}

	var mime = encoded.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/)

	if (mime && mime.length) {
		result = mime[1]
	}

	return result
}

// const handleViewPDF = (TypedArray: Uint8Array) => {
//   // Asynchronous download of PDF
//   const loadingTask = PDFJS.getDocument(TypedArray)
//   loadingTask.promise.then(
//     (pdf) => {
//       console.log('PDF loaded')

//       const totalPages = pdf?.numPages || 1
//       const scale = 1.5
//       const viewer = document.getElementById(ID_PDF_VIEWER) as HTMLElement

//       for (let i = 1; i <= totalPages; i++) {
//         const canvas = document.createElement('canvas')
//         const context = canvas.getContext('2d')
//         canvas.className = Class_ITEM_PAGE_PDF
//         // viewer.appendChild(canvas)

//         // Render
//         pdf.getPage(i).then((page) => {
//           const viewport = page.getViewport({ scale })
//           canvas.height = viewport.height
//           canvas.width = viewport.width

//           const renderContext = {
//             canvasContext: context,
//             viewport: viewport,
//           }

//           page.render(renderContext as any).promise.then(() => {
//             // console.log(`Page ${i} rendered`)
//             // Await render content to get image
//             const imageDataURL = canvas.toDataURL('image/png')
//             const image = document.createElement('img')
//             image.src = imageDataURL
//             image.className = Class_ITEM_PAGE_PDF
//             viewer.appendChild(image)

//             // imageBase64ToFileObject(imageDataURL)
//           })
//         })
//       }
//     },
//     (reason) => {
//       // PDF loading error
//       console.error(reason)
//     },
//   )
// }

const handleViewPDF = (TypedArray: Uint8Array) => {
	// Asynchronous download of PDF
	const loadingTask = PDFJS.getDocument(TypedArray)
	loadingTask.promise.then(
		async (pdf) => {
			console.log('PDF loaded')

			const totalPages = pdf?.numPages || 1
			const scales = { 1: 3.2, 2: 4 }
			const defaultScale = 3
			const scale =
				scales[window.devicePixelRatio as keyof typeof scales] || defaultScale
			const viewer = document.getElementById(ID_PDF_VIEWER) as HTMLElement

			for (let i = 1; i <= totalPages; i++) {
				const canvas = document.createElement('canvas')
				const context = canvas.getContext('2d')
				canvas.className = Class_ITEM_PAGE_PDF
				// viewer.appendChild(canvas)

				// Render
				const page = await pdf.getPage(i)
				const viewport = page.getViewport({ scale: scale })
				canvas.height = viewport.height
				canvas.width = viewport.width

				const displayWidth = 1.5
				canvas.style.width = `${(viewport.width * displayWidth) / scale}px`
				canvas.style.height = `${(viewport.height * displayWidth) / scale}px`

				const renderContext = {
					canvasContext: context,
					viewport: viewport
				}

				await page.render(renderContext as any).promise
				const imageDataURL = canvas.toDataURL('image/png')
				const image = document.createElement('img')
				image.src = imageDataURL
				image.style.maxWidth = '100%'

				const divWrapperImage = document.createElement('div')
				divWrapperImage.className = Class_ITEM_PAGE_PDF
				divWrapperImage.style.height = '1400px' // 1400px is contain enough for one page
				divWrapperImage.appendChild(image)

				viewer.appendChild(divWrapperImage)

				// imageBase64ToFileObject(imageDataURL)
			}
		},
		(reason) => {
			// PDF loading error
			console.error(reason)
		}
	)
}

const handleExport = async () => {
	try {
		const elementHTML = document.getElementById(ID_PDF_VIEWER)
		const canvas = await html2canvas(elementHTML as HTMLElement, {
			useCORS: true,
			removeContainer: true
		})

		const doc = new jsPDF('p', 'mm', 'a4', true)
		const imgData = canvas.toDataURL('image/png')
		const imgWidth = 210
		const imgHeight = (canvas.height * imgWidth) / canvas.width
		const pageHeight = doc.internal.pageSize.getHeight()
		const totalPageSize = Math.ceil(imgHeight / pageHeight)
		let yPosition = 0

		doc.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight)

		for (let pageIndex = 1; pageIndex < totalPageSize; pageIndex++) {
			// making it negative to crop the image
			yPosition = pageIndex * pageHeight * -1
			doc.addPage()
			doc.addImage(imgData, 'PNG', 0, yPosition, imgWidth, imgHeight)
		}

		window.open(doc.output('bloburl'), '_blank')
		// doc.save('file.pdf')
	} catch (error) {
		console.log(error)
	}
}
</script>

<template>
	<div class="p-1 lg:p-4 h-screen bg-white overflow-auto">
		<div class="mx-auto">
			<div class="mb-4 flex items-center gap-4">
				<input type="file" ref="inputFile" @change="onChangeFile" />
				<!-- <ButtonExportPDF :idElement="ID_PDF_VIEWER" /> -->
				<button
					class="p-1 border border-solid rounded cursor-pointer"
					@click="handleExport"
				>
					Export
				</button>
			</div>

			<div
				class="p-1 lg:p-4 max-w-[1024px] mx-auto text-center border border-solid border-gray-200 rounded-lg"
			>
				<div :id="ID_PDF_VIEWER"></div>
			</div>
		</div>
	</div>
</template>
