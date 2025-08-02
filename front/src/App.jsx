import Header from './components/Header'
import GameCard from './components/GameCard'
import Game from './components/Game'
import Navigate from './components/Navigate'
import CategoryFilter from './components/CategoryFilter'
import { games, categories } from './data'
import { useState } from 'react'

function App() {
	const [content, setContent] = useState('content');
	const [activeCategory, setActiveCategory] = useState('all');
	const [currentGame, setCurrentGame] = useState(null);

	const filteredGames = activeCategory === 'all' 
		? games 
		: games.filter(game => game.category === activeCategory);

	const handleCategoryChange = (categoryId) => {
		setActiveCategory(categoryId);
	};

	const handleGameStart = (gameTitle) => {
		if (gameTitle === '21') {
			setCurrentGame(gameTitle);
		} else {
			console.log('clicked', gameTitle);
		}
	};

	return (
		<div className="casino-bg min-h-screen">
			{currentGame ? (
				<Game 
					gameTitle={currentGame} 
					onBack={() => setCurrentGame(null)}
				/>
			) : (
				<>
					{/* <Header /> */}
					{/* <Navigate /> */}
					<main className="container mx-auto px-6 py-8">
						<section>
							<div className="text-center mb-12">
								<h1 className="text-5xl font-bold text-white mb-4">
									Популярные игры
								</h1>
								<div className="w-24 h-1 bg-gradient-to-r from-yellow-400 to-orange-500 mx-auto rounded-full"></div>
							</div>

							<div className="flex justify-center mb-8">
								<CategoryFilter 
									categories={categories}
									activeCategory={activeCategory}
									onCategoryChange={handleCategoryChange}
								/>
							</div>

							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
								{filteredGames.map((game) => (
									<GameCard 
										key={game.id}
										title={game.title} 
										description={game.description} 
										image={game.image}
										buttonColor={game.buttonColor}
										setContent={handleGameStart} 
									/>
								))}
							</div>
						</section>
					</main>
				</>
			)}
		</div>
	)
}

export default App
