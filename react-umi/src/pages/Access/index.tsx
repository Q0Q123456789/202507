import PageContainer from '@/components/Container/index.tsx'
import { Access, useAccess } from '@umijs/max'
import { App, Button } from 'antd'

const AccessPage: React.FC = () => {
	const access = useAccess()
	const { message, modal, notification } = App.useApp()
	const showMessage = () => {
		message.success('Success!')
	}
	return (
		<PageContainer>
			<Access accessible={access.canSeeAdmin}>
				<Button onClick={showMessage}>只有 Admin 可以看到这个按钮</Button>
			</Access>
		</PageContainer>
	)
}

export default AccessPage
