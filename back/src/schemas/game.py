from datetime import datetime
from typing import List, Dict, Any
from pydantic import Field

from .base import BaseSchema


class Card(BaseSchema):
    """Схема карты."""
    
    suit: str = Field(title="Масть", examples=["hearts", "diamonds", "clubs", "spades"])
    rank: str = Field(title="Значение", examples=["A", "6", "7", "8", "9", "10", "J", "Q", "K"])
    value: int = Field(title="Очки", examples=[11, 6, 7, 8, 9, 10, 2, 3, 4])


class GameStatus(BaseSchema):
    """Схема статуса игры."""
    
    game_id: int = Field(title="ID игры", examples=[1])
    player_cards: List[Dict[str, Any]] = Field(title="Карты игрока", examples=[[{"suit": "hearts", "rank": "A", "value": 11}]])
    dealer_cards: List[Dict[str, Any]] = Field(title="Карты дилера", examples=[[{"suit": "spades", "rank": "K", "value": 10}]])
    player_score: int = Field(title="Очки игрока", examples=[21])
    dealer_score: int = Field(title="Очки дилера", examples=[10])
    status: str = Field(title="Статус игры", examples=["playing", "bust", "win", "lose", "draw"])
    created_at: datetime = Field(title="Время создания")
    updated_at: datetime = Field(title="Время обновления")


class GameStart(BaseSchema):
    """Ответ на начало игры."""
    
    game_id: int = Field(title="ID игры", examples=[1])
    player_cards: List[Dict[str, Any]] = Field(title="Карты игрока")
    dealer_cards: List[Dict[str, Any]] = Field(title="Карты дилера (одна скрыта)")
    player_score: int = Field(title="Очки игрока")
    dealer_score: int = Field(title="Очки дилера (видимые)")
    status: str = Field(title="Статус игры", examples=["playing"])


class GameAction(BaseSchema):
    """Ответ на действие игрока."""
    
    game_id: int = Field(title="ID игры", examples=[1])
    player_cards: List[Dict[str, Any]] = Field(title="Карты игрока")
    dealer_cards: List[Dict[str, Any]] = Field(title="Карты дилера")
    player_score: int = Field(title="Очки игрока")
    dealer_score: int = Field(title="Очки дилера")
    status: str = Field(title="Статус игры", examples=["playing", "bust", "win", "lose", "draw"])
    message: str = Field(title="Сообщение", examples=["Вы выиграли!", "Перебор!", "Ничья!"]) 