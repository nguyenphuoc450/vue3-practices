import { useFetch } from '@vueuse/core'

const BASE_URL = 'https://api.waifu.pics'
const TYPE_IMAGE = <const>[
	'waifu',
	'neko',
	'shinobu',
	'megumin',
	'bully',
	'cuddle',
	'cry',
	'hug',
	'awoo',
	'kiss',
	'lick',
	'pat',
	'smug',
	'bonk',
	'yeet',
	'blush',
	'smile',
	'wave',
	'highfive',
	'handhold',
	'nom',
	'bite',
	'glomp',
	'slap',
	'kill',
	'kick',
	'happy',
	'wink',
	'poke',
	'dance',
	'cringe'
]

const getImage = async (type: (typeof TYPE_IMAGE)[number]) => {
	return await useFetch(`${BASE_URL}/sfw/${type}`)
}

const getManyImage = async (type: (typeof TYPE_IMAGE)[number]) => {
	return await useFetch(`${BASE_URL}/many/sfw/${type}`)
		.post({ exclude: [] })
		.json()
}

export default {
	getImage,
	getManyImage
}
