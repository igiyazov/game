export default function CategoryFilter({ categories, activeCategory, onCategoryChange }) {
	return (
		<div className="flex gap-2 mb-8">
			{categories.map((category) => (
				<button
					key={category.id}
					onClick={() => onCategoryChange(category.id)}
					className={`px-6 py-3 rounded-full text-white font-medium transition-all duration-300 ${
						activeCategory === category.id
							? 'bg-gradient-to-r from-amber-600 to-amber-700 shadow-lg'
							: 'bg-gray-800 hover:bg-gray-700'
					}`}
				>
					{category.name}
				</button>
			))}
		</div>
	);
} 