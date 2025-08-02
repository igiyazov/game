export const games = [
	{
		id: 1,
		title: '21',
		slug: '21',
		description: 'Игра в 21',
		category: 'card',
		image: '/images/21.jpg',
		buttonColor: 'bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800',
	},
	{
		id: 2,
		title: 'Нарды',
		slug: 'nardi',
		description: 'Игра в нарды',
		category: 'board',
		image: '/images/nardi.jpg',
		buttonColor: 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800',
	},
	{
		id: 3,
		title: 'Крестики-нолики',
		slug: 'xo',
		description: 'Игра в крестики-нолики',
		category: 'logic',
		image: '/images/xo.jpg',
		buttonColor: 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800',
	},
];

export const categories = [
	{ id: 'all', name: 'Все' },
	{ id: 'card', name: 'Карточные' },
	{ id: 'board', name: 'Настольные' },
	{ id: 'logic', name: 'Логические' },
];