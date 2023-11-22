import { useFetch } from '@vueuse/core'

const getImage = async () => {
	return await useFetch('https://api.waifu.pics/sfw/waifu')
}

const getManyImage = async () => {
	return await useFetch('https://api.waifu.pics/many/sfw/waifu')
		.post({ exclude: [] })
		.json()
}

export default {
	getImage,
	getManyImage
}
