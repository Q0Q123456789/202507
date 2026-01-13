import '@umijs/max/typings'

declare module '*.less' {
	const content: { [className: string]: string }
	export default content
}

declare module '*.css' {
	const content: { [className: string]: string }
	export default content
}
