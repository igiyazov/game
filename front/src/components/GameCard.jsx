import Button from './Button';

export default function GameCard({ title, description, image, buttonColor, setContent }) {
	function onClickHandler(gameName) {
		console.log('clicked', gameName);
		setContent(gameName);
	}
	
	return (
		<div className="game-card rounded-2xl overflow-hidden relative h-80 group">
			<div className="w-full h-48 relative overflow-hidden">
				<img 
					src={image} 
					alt={title}
					className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
				/>
				<div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
			</div>
			
			<div className="p-6 relative z-10">
				<h3 className="text-white text-xl font-bold mb-2 group-hover:text-yellow-300 transition-colors">
					{title}
				</h3>
				
				<button
					// onClick={() => onClickHandler(title)}
					href={`https://game.pyramidgames.fun`}
					className={`w-full py-3 px-6 rounded-lg text-white font-semibold text-lg transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg ${buttonColor}`}
				>
					Играть
				</button>
			</div>
		</div>
	);
}
