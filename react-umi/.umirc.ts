import { defineConfig } from '@umijs/max'

export default defineConfig({
	 plugins: [
    require.resolve('@umijs/plugins/dist/unocss')
  ],
  unocss: {
    // 检测 className 的文件范围，若项目不包含 src 目录，可使用 `pages/**/*.tsx`
    watch: ['src/**/*.tsx']
  },
	antd: {
		// configProvider
		configProvider: {},
		// themes
		dark: false,
		compact: true,
		// less or css, default less
		style: 'less',
		// shortcut of `configProvider.theme`
		// use to configure theme token, antd v5 only
		theme: {},
		// antd <App /> valid for version 5.1.0 or higher, default: undefined
		appConfig: {},
		// Transform DayJS to MomentJS
		momentPicker: true,
		// Add StyleProvider for legacy browsers
		styleProvider: {
			hashPriority: 'high',
			legacyTransformer: true
		}
	},
	access: {},
	model: {},
	initialState: {},
	request: {},
	layout: {
		title: '@umijs/max'
	},
	routes: [
		{
			path: '/',
			name: '首页',
			component: '@/layouts/index',
			layout: false,
			routes: [
				{
					path: '/',
					redirect: '/home'
				},
				{
					name: '首页',
					path: '/home',
					component: './Home'
				},
				{
					name: '权限演示',
					path: '/access',
					component: './Access'
				},
				{
					name: 'CRUD 示例',
					path: '/table',
					component: './Table'
				},
				{
					name: '无限滚动示例',
					path: '/infiniteScroll',
					component: './InfiniteScroll'
				}
			]
		},
		{
			path: '/login',
			component: '@/components/Login/index.tsx',
			layout: false // 不使用全局布局
		},
		{
			path: '*',
			component: '@/components/404/index.tsx'
		}
	],
	npmClient: 'pnpm'
})
