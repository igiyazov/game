from typing import List, Dict, Any

from fastapi import Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from db.dependencies import get_db_session
from db.models.game_session import GameSession


class GameSessionCRUD:
    """Class for accessing game_sessions table."""

    def __init__(self, session: AsyncSession = Depends(get_db_session)):
        self.session = session

    async def create(self, player_cards: List[Dict[str, Any]], dealer_cards: List[Dict[str, Any]], 
                     player_score: int, dealer_score: int, cards_drawn: int = 0, status: str = "playing") -> GameSession:
        """
        Create a new game session.

        :param player_cards: player's cards
        :param dealer_cards: dealer's cards
        :param player_score: player's score
        :param dealer_score: dealer's score
        :param status: game status
        :return: created game session
        """
        game_session = GameSession(
            player_cards=player_cards,
            dealer_cards=dealer_cards,
            player_score=player_score,
            dealer_score=dealer_score,
            cards_drawn=cards_drawn,
            status=status
        )
        self.session.add(game_session)
        await self.session.flush()
        return game_session

    async def get_by_id(self, game_id: int) -> GameSession | None:
        """
        Get game session by ID.

        :param game_id: game session ID
        :return: game session or None
        """
        result = await self.session.execute(
            select(GameSession).where(GameSession.id == game_id)
        )
        return result.scalar_one_or_none()

    async def update(self, game_id: int, player_cards: List[Dict[str, Any]] | None = None,
                     dealer_cards: List[Dict[str, Any]] | None = None, player_score: int | None = None,
                     dealer_score: int | None = None, cards_drawn: int | None = None, status: str | None = None) -> GameSession | None:
        """
        Update game session.

        :param game_id: game session ID
        :param player_cards: player's cards
        :param dealer_cards: dealer's cards
        :param player_score: player's score
        :param dealer_score: dealer's score
        :param status: game status
        :return: updated game session or None
        """
        game_session = await self.get_by_id(game_id)
        if not game_session:
            return None

        if player_cards is not None:
            game_session.player_cards = player_cards
        if dealer_cards is not None:
            game_session.dealer_cards = dealer_cards
        if player_score is not None:
            game_session.player_score = player_score
        if dealer_score is not None:
            game_session.dealer_score = dealer_score
        if cards_drawn is not None:
            game_session.cards_drawn = cards_drawn
        if status is not None:
            game_session.status = status

        await self.session.flush()
        return game_session 