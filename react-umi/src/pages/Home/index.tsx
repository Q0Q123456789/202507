import PageContainer from '@/components/Container/index.tsx'
import { useModel } from '@umijs/max'

const HomePage: React.FC = () => {
	const global = useModel('info')
	console.log('info', global)
	return (
		<PageContainer>
			<div>111</div>
		</PageContainer>
	)
}

export default HomePage
