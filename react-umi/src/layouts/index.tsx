// src/layouts/index.tsx
import { useAccessMarkedRoutes } from '@@/plugin-access'
import { AntDesignOutlined } from '@ant-design/icons'
import {
	matchRoutes,
	Outlet,
	useAppData,
	useLocation,
	useNavigate,
	type IClientRoute,
	type IRoute
} from '@umijs/max'
import type { MenuProps } from 'antd'
import { Avatar, Breadcrumb, Layout, Menu, theme } from 'antd'
import React, { useMemo } from 'react'
import style from './index.less'

const { Header, Content, Sider } = Layout

const items1: MenuProps['items'] = ['1', '2', '3'].map((key) => ({
	key,
	label: `nav ${key}`
}))

// 过滤出需要显示的路由, 这里的filterFn 指 不希望显示的层级
const filterRoutes = (
	routes: IClientRoute[],
	filterFn: (route: IRoute) => boolean
) => {
	if (routes.length === 0) {
		return []
	}

	let newRoutes = []
	for (const route of routes) {
		const newRoute = { ...route }
		if (filterFn(route)) {
			if (Array.isArray(newRoute.routes)) {
				newRoutes.push(...filterRoutes(newRoute.routes, filterFn))
			}
		} else {
			if (Array.isArray(newRoute.children)) {
				newRoute.children = filterRoutes(newRoute.children, filterFn)
				newRoute.routes = newRoute.children
			}
			newRoutes.push(newRoute)
		}
	}

	return newRoutes
}

// 格式化路由 处理因 wrapper 导致的 菜单 path 不一致
const mapRoutes = (routes: IRoute[]) => {
	if (routes.length === 0) {
		return []
	}
	return routes.map((route) => {
		// 需要 copy 一份, 否则会污染原始数据
		const newRoute = { ...route }
		if (route.originPath) {
			newRoute.path = route.originPath
		}

		if (Array.isArray(route.routes)) {
			newRoute.routes = mapRoutes(route.routes)
		}

		if (Array.isArray(route.children)) {
			newRoute.children = mapRoutes(route.children)
		}

		return newRoute
	})
}

const App: React.FC = () => {
	const {
		token: { colorBgContainer, borderRadiusLG }
	} = theme.useToken()

	const location = useLocation()
	const navigate = useNavigate()
	const { clientRoutes, pluginManager } = useAppData()
	// 现在的 layout 及 wrapper 实现是通过父路由的形式实现的, 会导致路由数据多了冗余层级, proLayout 消费时, 无法正确展示菜单, 这里对冗余数据进行过滤操作
	const newRoutes = filterRoutes(
		clientRoutes.filter((route) => route.id !== 'ant-design-pro-layout'),
		(route) => {
			return (
				(!!route.isLayout && route.id !== 'ant-design-pro-layout') ||
				!!route.isWrapper
			)
		}
	)
	// 返回栏目
	const [route] = useAccessMarkedRoutes(mapRoutes(newRoutes))
	// 栏目回显选中
	const matchedRoute = useMemo(
		() => matchRoutes(route.children, location.pathname)?.pop?.()?.route,
		[location.pathname]
	)
	return (
		<Layout style={{ height: '100vh', width: '100vw' }}>
			<Header className={style.header}>
				<div className={style.demoLogo} />
				<Menu
					theme="dark"
					mode="horizontal"
					defaultSelectedKeys={[]}
					items={[]}
					style={{ flex: 1, minWidth: 0 }}
				/>
				<Avatar size={56} icon={<AntDesignOutlined />} />
			</Header>
			<Layout className={style.main}>
				<Sider width={200} style={{ background: colorBgContainer }}>
					<Menu
						mode="inline"
						defaultSelectedKeys={[matchedRoute?.path || '']}
						defaultOpenKeys={['sub1']}
						style={{ height: '100%', borderInlineEnd: 0 }}
						items={route.children
							.filter((r) => r.path !== '/')
							.map((r) => {
								return {
									key: r.path!,
									label: r.name,
									onClick: () => {
										navigate(r.path!)
									}
								}
							})}
					/>
				</Sider>
				<Layout style={{ padding: '0 20px 20px' }}>
					<Breadcrumb
						items={[{ title: 'Home' }, { title: 'List' }, { title: 'App' }]}
						style={{ margin: '10px 0' }}
					/>
					<Content
						style={{
							padding: 10,
							margin: 0,
							background: colorBgContainer,
							borderRadius: borderRadiusLG
						}}
					>
						<Outlet />
					</Content>
				</Layout>
			</Layout>
		</Layout>
	)
}

export default App
