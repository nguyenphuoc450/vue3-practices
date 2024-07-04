<script setup lang="ts">
import { ref, onMounted } from 'vue'

const emit = defineEmits(['onCreate'])

const ID_SIGN_CANVAS = 'sig-canvas'

const drawSignature = () => {
	const canvas = document.getElementById(ID_SIGN_CANVAS) as HTMLCanvasElement
	const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
	const path = new Path2D()
	const mouse = {} as any

	function draw() {
		// clear all
		ctx.clearRect(0, 0, canvas.width, canvas.height)
		// draw the single path
		ctx.stroke(path)
		// tell we need to redraw next frame
		mouse.dirty = false
	}

	canvas.onmousedown = (evt) => {
		mouse.down = true
		// always use the same path
		path.moveTo(evt.offsetX, evt.offsetY)
	}
	document.onmouseup = (evt) => {
		mouse.down = false
	}
	document.onmousemove = (evt) => {
		if (mouse.down) {
			const rect = canvas.getBoundingClientRect()
			path.lineTo(evt.clientX - rect.left, evt.clientY - rect.top)
		}
		if (!mouse.dirty) {
			mouse.dirty = true
			requestAnimationFrame(draw)
		}
	}
}

const clearCanvas = () => {
	const canvas = document.getElementById(ID_SIGN_CANVAS) as HTMLCanvasElement
	const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
	ctx?.clearRect(0, 0, canvas.width, canvas.height)
	window.requestAnimationFrame(drawSignature)
}

const createSignature = () => {
	const canvas = document.getElementById(ID_SIGN_CANVAS) as HTMLCanvasElement
	const dataUrl = canvas?.toDataURL()
	emit('onCreate', dataUrl)

	clearCanvas()
}

onMounted(() => {
	drawSignature()
})
</script>

<template>
	<div class="w-fit mx-auto p-2 bg-white rounded">
		<canvas class="mb-4" id="sig-canvas" ref="canvas" width="540" height="160">
			Get a better browser, bro.
		</canvas>

		<div class="flex justify-end gap-4">
			<button
				class="p-1 bg-white border border-solid rounded"
				type="button"
				@click="clearCanvas"
			>
				Clear
			</button>
			<button
				class="p-1 bg-white border border-solid rounded"
				type="button"
				@click="createSignature"
			>
				Save
			</button>
		</div>
	</div>
</template>

<style lang="scss" scoped>
#sig-canvas {
	border: 2px solid #e1e1e1;
	border-radius: 4px;
}
</style>
