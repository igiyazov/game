import Button from './Button'
import { useState } from 'react'

export default function Navigate() {
    const [contentType, setContentType] = useState('21');
    function onClickHandler(gameName) {
        setContentType(gameName);
    }
    
	return (
		<div className="flex flex-row justify-start">
			<Button type="navigate" isActive={contentType === '21'} onClick={() => onClickHandler('21')}>All games</Button>
			<Button type="navigate" isActive={contentType === 'Nardi'} onClick={() => onClickHandler('Nardi')}>Cards</Button>
			<Button type="navigate" isActive={contentType === 'XO'} onClick={() => onClickHandler('XO')}>Other</Button>	
		</div>
	)
}