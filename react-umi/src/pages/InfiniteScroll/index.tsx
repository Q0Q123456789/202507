import PageContainer from '@/components/Container/index.tsx'
import React, { useEffect, useRef, useState } from 'react'
interface Card {
	id: number
	title: string
	description: string
}

const fetchCards = (page: number, pageSize: number): Promise<Card[]> => {
	// 模拟异步请求
	return new Promise((resolve) => {
		setTimeout(() => {
			const cards = Array.from({ length: pageSize }, (_, i) => ({
				id: page * pageSize + i,
				title: `卡片标题 ${page * pageSize + i + 1}`,
				description: `这是第 ${page * pageSize + i + 1} 个卡片的描述。`
			}))
			resolve(cards)
		}, 800)
	})
}

const InfiniteScroll: React.FC = () => {
	const [cards, setCards] = useState<Card[]>([])
	const [page, setPage] = useState(0)
	const [loading, setLoading] = useState(false)
	const [hasMore, setHasMore] = useState(true)
	const containerRef = useRef<HTMLDivElement>(null)

	const PAGE_SIZE = 150

	useEffect(() => {
		const loadCards = async () => {
			setLoading(true)
			const newCards = await fetchCards(page, PAGE_SIZE)
			setCards((prev) => [...prev, ...newCards])
			setHasMore(newCards.length === PAGE_SIZE)
			setLoading(false)
		}
		loadCards()
	}, [page])

	useEffect(() => {
		const handleScroll = () => {
			const container = containerRef.current
			if (
				container &&
				container.scrollHeight - container.scrollTop <=
					container.clientHeight + 100 &&
				!loading &&
				hasMore
			) {
				setPage((prev) => prev + 1)
			}
		}
		const container = containerRef.current
		if (container) {
			container.addEventListener('scroll', handleScroll)
		}
		return () => {
			if (container) {
				container.removeEventListener('scroll', handleScroll)
			}
		}
	}, [loading, hasMore])

	return (
		<PageContainer>
			<div
				ref={containerRef}
				style={{
					height: '90vh',
					overflowY: 'auto'
				}}
			>
				<div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
					{cards.map((card) => (
						<div
							key={card.id}
							style={{
								background: '#fff',
								borderRadius: 8,
								boxShadow: '2px 2px 8px rgba(0,0,0,0.1)',
								padding: 16,
								width: '220px'
							}}
						>
							<h3>{card.title}</h3>
							<p>{card.description}</p>
						</div>
					))}
				</div>
				{loading && (
					<div style={{ textAlign: 'center', margin: 16 }}>加载中...</div>
				)}
				{!hasMore && (
					<div style={{ textAlign: 'center', margin: 16 }}>没有更多了</div>
				)}
			</div>
		</PageContainer>
	)
}

export default InfiniteScroll
