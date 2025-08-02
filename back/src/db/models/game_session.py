from datetime import datetime
from typing import List, Dict, Any

from sqlalchemy import DateTime, JSON, String, Integer
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.sql import func

from db.base import Base


class GameSession(Base):
    """Model for blackjack game session."""

    __tablename__ = "game_sessions"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    player_cards: Mapped[List[Dict[str, Any]]] = mapped_column(JSON, default=list)
    dealer_cards: Mapped[List[Dict[str, Any]]] = mapped_column(JSON, default=list)
    player_score: Mapped[int] = mapped_column(Integer, default=0)
    dealer_score: Mapped[int] = mapped_column(Integer, default=0)
    cards_drawn: Mapped[int] = mapped_column(Integer, default=0)  # Number of additional cards drawn
    status: Mapped[str] = mapped_column(String(20), default="playing")  # playing, bust, win, lose, draw
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now(), onupdate=func.now()) 