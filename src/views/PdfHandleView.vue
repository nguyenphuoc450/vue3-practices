<script setup lang="ts">
import * as PDFJS from 'pdfjs-dist'
import { jsPDF } from 'jspdf'
import html2canvas from 'html2canvas'
import { onBeforeUnmount, ref } from 'vue'
import SignaturePad from '~/components/SignaturePad.vue'

// // The workerSrc property shall be specified.
PDFJS.GlobalWorkerOptions.workerSrc = PDFJS.GlobalWorkerOptions.workerSrc =
	new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString()

const ID_PDF_VIEWER = 'pdf-viewer'
const Class_ITEM_PAGE_PDF = 'pdf-page-canvas'
const ID_SIGNATURE = 'signature'

const inputFilePdf = ref<HTMLInputElement>()
const inputFileImage = ref<HTMLInputElement>()
const imageSignature = ref('')
const visibleSignaturePad = ref(false)

const onChangeFilePdf = (e: Event) => {
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
	if (inputFilePdf.value) {
		inputFilePdf.value.value = ''
	}
}

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

const onChangeImageSignature = (e: Event) => {
	const files = (e.target as HTMLInputElement).files

	if (files && files?.length > 0) {
		const file = files[0]
		if (imageSignature.value) {
			window.URL.revokeObjectURL(imageSignature.value)
		}
		imageSignature.value = window.URL.createObjectURL(file)

		initSignatureByUpload()
	}

	// Reset value file
	if (inputFileImage.value) {
		inputFileImage.value.value = ''
	}
}

const initSignatureByUpload = () => {
	const elementHTML = document.getElementById(ID_PDF_VIEWER)
	const div = document.createElement('div')
	div.id = ID_SIGNATURE

	const img = document.createElement('img')
	img.src = imageSignature.value
	img.style.maxWidth = '400px'
	img.style.maxHeight = '200px'
	img.style.objectFit = 'cover'

	div.addEventListener('mousedown', (event: Event) => {
		event.preventDefault()
		startMouseMove()
	})

	div.appendChild(img)
	elementHTML?.appendChild(div)

	startMouseMove()
}

const toggleSignaturePad = () => {
	visibleSignaturePad.value = !visibleSignaturePad.value
}

const initSignatureByPad = (url: string) => {
	const elementHTML = document.getElementById(ID_PDF_VIEWER)
	const div = document.createElement('div')
	div.id = ID_SIGNATURE

	const img = document.createElement('img')
	img.src = url

	div.addEventListener('mousedown', (event: Event) => {
		event.preventDefault()
		startMouseMove()
	})

	div.appendChild(img)
	elementHTML?.appendChild(div)

	startMouseMove()
}

const onMouseMove = (e: MouseEvent) => {
	const sign = document.getElementById(ID_SIGNATURE)
	const positionY =
		e.pageY - (e?.currentTarget as HTMLElement)?.getBoundingClientRect()?.top
	const positionX = e.offsetX

	if (sign) {
		sign.style.top = positionY + 'px'
		sign.style.left = positionX + 'px'
	}
}

const startMouseMove = () => {
	const elementHTML = document.getElementById(ID_PDF_VIEWER)
	elementHTML?.addEventListener('mousemove', onMouseMove)

	const sign = document.getElementById(ID_SIGNATURE)
	if (sign) {
		document.body.style.cursor = 'move'
		sign.classList.add('moving')
		sign.classList.remove('moved')
	}
}

const stopMouseMove = () => {
	const elementHTML = document.getElementById(ID_PDF_VIEWER)
	elementHTML?.removeEventListener('mousemove', onMouseMove)

	const sign = document.getElementById(ID_SIGNATURE)
	if (sign) {
		document.body.style.cursor = 'default'
		sign.classList.add('moved')
		sign.classList.remove('moving')
	}
}

const dropSignature = (e: Event) => {
	stopMouseMove()
}

onBeforeUnmount(() => {
	stopMouseMove()
})
</script>

<template>
	<div class="p-1 lg:p-4 h-screen bg-[#f0f3f5] overflow-auto">
		<div class="mx-auto">
			<div class="mb-4 flex items-center gap-4">
				<input
					type="file"
					accept="application/pdf"
					ref="inputFilePdf"
					@change="onChangeFilePdf"
				/>

				<!-- upload image signature -->
				<button
					class="p-1 bg-white border border-solid rounded"
					type="button"
					@click="inputFileImage?.click()"
				>
					Upload image signature
				</button>
				<input
					class="hidden"
					type="file"
					accept="image/*"
					ref="inputFileImage"
					@change="onChangeImageSignature"
				/>

				<button
					class="p-1 bg-white border border-solid rounded"
					type="button"
					@click="toggleSignaturePad"
				>
					Toggle signature pad
				</button>

				<button
					class="p-1 bg-white border border-solid rounded"
					type="button"
					@click="handleExport"
				>
					Export Pdf
				</button>
			</div>

			<div class="mb-4" v-if="visibleSignaturePad">
				<SignaturePad @onCreate="initSignatureByPad" />
			</div>

			<div class="p-1 lg:p-4 max-w-[1024px] mx-auto text-center">
				<div
					:id="ID_PDF_VIEWER"
					class="relative overflow-hidden"
					@click="dropSignature"
				></div>
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
:deep {
	.pdf-page-canvas {
		background-color: #ffffff;
		border: 1px solid #eeeef0;
		border-radius: 8px;

		&:not(:last-child) {
			margin-bottom: 4px;
		}

		img {
			border-radius: 8px;
		}
	}

	#signature {
		position: absolute;
		transform: translate(-50%, -50%);
		pointer-events: none;
		&.moved {
			pointer-events: unset;
			img {
				cursor: pointer;
			}
		}
		&.moving {
			border: 1px dashed rgb(58, 178, 248);
			border-radius: 4px;
		}
	}
}
</style>
