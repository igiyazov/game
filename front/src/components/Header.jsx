import { useState } from 'react'

export default function Header() {
    const [time, setTime] = useState(new Date().toLocaleTimeString());
    setInterval(() => {
       setTime(new Date().toLocaleTimeString());
    }, 1000);
    return (
        <header className="w-full h-20 p-4 border-b-2 border-b-gray-400">
            <h3 className="text-white flex font-bold text-2xl">All games</h3>
            <span className="text-gray-700">Local time: {time}</span>
        </header>
    )
}