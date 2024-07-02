<script setup lang="ts">
import { ref, onMounted } from 'vue'

const emit = defineEmits(['onCreate'])

const canvas = ref<HTMLCanvasElement>()

const drawSignature = () => {
	var canvas = document.getElementById('sig-canvas') as HTMLCanvasElement
	var ctx = canvas.getContext('2d') as CanvasRenderingContext2D

	var drawing = false
	var mousePos = {
		x: 0,
		y: 0
	}
	var lastPos = mousePos

	canvas.addEventListener(
		'mousedown',
		function (e) {
			drawing = true
			lastPos = getMousePos(canvas, e)
		},
		false
	)

	canvas.addEventListener(
		'mouseup',
		function (e) {
			drawing = false
		},
		false
	)

	canvas.addEventListener(
		'mousemove',
		function (e) {
			mousePos = getMousePos(canvas, e)
		},
		false
	)

	// Add touch event support for mobile
	canvas.addEventListener('touchstart', function (e) {}, false)

	canvas.addEventListener(
		'touchmove',
		function (e) {
			var touch = e.touches[0]
			var me = new MouseEvent('mousemove', {
				clientX: touch.clientX,
				clientY: touch.clientY
			})
			canvas.dispatchEvent(me)
		},
		false
	)

	canvas.addEventListener(
		'touchstart',
		function (e) {
			mousePos = getTouchPos(canvas, e)
			var touch = e.touches[0]
			var me = new MouseEvent('mousedown', {
				clientX: touch.clientX,
				clientY: touch.clientY
			})
			canvas.dispatchEvent(me)
		},
		false
	)

	canvas.addEventListener(
		'touchend',
		function (e) {
			var me = new MouseEvent('mouseup', {})
			canvas.dispatchEvent(me)
		},
		false
	)

	function getMousePos(canvasDom: any, mouseEvent: any) {
		var rect = canvasDom.getBoundingClientRect()
		return {
			x: mouseEvent.clientX - rect.left,
			y: mouseEvent.clientY - rect.top
		}
	}

	function getTouchPos(canvasDom: any, touchEvent: any) {
		var rect = canvasDom.getBoundingClientRect()
		return {
			x: touchEvent.touches[0].clientX - rect.left,
			y: touchEvent.touches[0].clientY - rect.top
		}
	}

	function renderCanvas() {
		if (drawing) {
			ctx.moveTo(lastPos.x, lastPos.y)
			ctx.lineTo(mousePos.x, mousePos.y)
			ctx.stroke()
			lastPos = mousePos
		}
	}

	// Prevent scrolling when touching the canvas
	document.body.addEventListener(
		'touchstart',
		function (e) {
			if (e.target == canvas) {
				e.preventDefault()
			}
		},
		false
	)
	document.body.addEventListener(
		'touchend',
		function (e) {
			if (e.target == canvas) {
				e.preventDefault()
			}
		},
		false
	)
	document.body.addEventListener(
		'touchmove',
		function (e) {
			if (e.target == canvas) {
				e.preventDefault()
			}
		},
		false
	)
	;(function drawLoop() {
		requestAnimationFrame(drawLoop)
		renderCanvas()
	})()

	function clearCanvas() {
		canvas.width = canvas.width
	}
}

const clearCanvas = () => {
	if (canvas.value) {
		canvas.value.width = canvas.value?.width
	}
}

const createSignature = () => {
	const dataUrl = canvas.value?.toDataURL()
	emit('onCreate', dataUrl)
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
