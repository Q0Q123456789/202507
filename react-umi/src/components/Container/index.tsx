import { PageContainer } from '@ant-design/pro-components'
import React from 'react'

interface Props {
	children: React.ReactNode
}

// 脚手架示例组件
const Container: React.FC<Props> = ({ children }) => {
	return (
		<PageContainer
			ghost
			childrenContentStyle={{ padding: 0 }}
			header={{
				style: {
					padding: '12px'
				}
			}}
		>
			{children}
		</PageContainer>
	)
}

export default Container
