import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: '/',
			name: 'home',
			component: () => import('~/views/HomeView.vue')
		},
		{
			path: '/waifu',
			name: 'waifu',
			component: () => import('~/views/WaifuView.vue')
		},
		{
			path: '/virtual-scroll',
			name: 'virtual-scroll',
			component: () => import('~/views/VirtualScrollView.vue')
		},
		{
			path: '/list-sortable',
			name: 'list-sortable',
			component: () => import('~/views/ListSortableView.vue')
		},
		{
			path: '/pdf-handle',
			name: 'pdf-handle',
			component: () => import('~/views/PdfHandleView.vue')
		}
	]
})

export default router
