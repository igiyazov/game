export default function Button({ children, onClick, type, isActive }) {
    const cssMap = {
        play: 'bg-blue-500 text-white block m-auto p-2 rounded-md active:bg-blue-600 transition-colors duration-300 w-30',
        navigate: 'bg-[#2d2845] text-white mr-2 p-2 rounded-md transition-colors duration-300 w-30',
        navigateActive: 'bg-[#7d5811] text-white mr-2 p-2 rounded-md transition-colors duration-300 w-30',
    }

	return (
		<button
			className={`button hover:cursor-pointer ${!isActive ? cssMap[type] : cssMap[type + 'Active']}`}
			onClick={onClick}
		>
			{children}
		</button>
	);
}