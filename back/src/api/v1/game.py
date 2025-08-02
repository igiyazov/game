from http import HTTPStatus
from typing import Annotated

from fastapi import APIRouter, HTTPException, Query
from fastapi.param_functions import Depends

from db.crud.game_session import GameSessionCRUD
from schemas.game import GameStatus, GameStart, GameAction
from services import get_blackjack_service

router = APIRouter(prefix="/game", tags=["game"])


@router.post("/start", summary="Начать новую игру", response_model=GameStart, status_code=HTTPStatus.CREATED)
async def start_game(
    game_crud: GameSessionCRUD = Depends(),
    blackjack_service = Depends(get_blackjack_service),
) -> GameStart:
    """
    Начать новую игру 21.
    
    Выдаются по 2 карты игроку и дилеру. Статус сессии становится "playing".
    """
    # Start new game
    player_cards, dealer_cards, player_score, dealer_score = blackjack_service.start_game()
    
    # Create game session
    game_session = await game_crud.create(
        player_cards=player_cards,
        dealer_cards=dealer_cards,
        player_score=player_score,
        dealer_score=dealer_score,
        status="playing"
    )
    
    # Return only visible dealer cards and score
    dealer_visible_cards = blackjack_service.get_dealer_visible_cards(dealer_cards)
    dealer_visible_score = blackjack_service.get_dealer_visible_score(dealer_cards)
    
    return GameStart(
        game_id=game_session.id,
        player_cards=player_cards,
        dealer_cards=dealer_visible_cards,
        player_score=player_score,
        dealer_score=dealer_visible_score,
        status="playing"
    )


@router.post("/hit", summary="Взять дополнительную карту", response_model=GameAction)
async def hit(
    game_id: Annotated[int, Query(description="ID игры")],
    game_crud: GameSessionCRUD = Depends(),
    blackjack_service = Depends(get_blackjack_service),
) -> GameAction:
    """
    Игрок берёт дополнительную карту.
    
    Если перебор (сумма > 21), статус становится "bust".
    """
    # Get game session
    game_session = await game_crud.get_by_id(game_id)
    if not game_session:
        raise HTTPException(status_code=404, detail="Игра не найдена")
    
    if game_session.status != "playing":
        raise HTTPException(status_code=400, detail="Игра уже завершена")
    
    # Check if player can draw more cards (max 3 additional cards)
    if game_session.cards_drawn >= 3:
        raise HTTPException(status_code=400, detail="Достигнут лимит карт (максимум 3 дополнительные карты)")
    
    # Player hits
    player_cards = game_session.player_cards.copy()
    new_card, new_score = blackjack_service.player_hit(player_cards)
    
    # Check for bust
    if new_score > 21:
        status = "bust"
        message = "Перебор! Вы проиграли."
        dealer_cards = game_session.dealer_cards
        dealer_score = game_session.dealer_score
    else:
        status = "playing"
        message = f"Взята карта: {new_card['rank']} {new_card['suit']}"
        dealer_cards = blackjack_service.get_dealer_visible_cards(game_session.dealer_cards)
        dealer_score = blackjack_service.get_dealer_visible_score(game_session.dealer_cards)
    
    # Update game session
    await game_crud.update(
        game_id=game_id,
        player_cards=player_cards,
        player_score=new_score,
        cards_drawn=game_session.cards_drawn + 1,
        status=status
    )
    
    return GameAction(
        game_id=game_id,
        player_cards=player_cards,
        dealer_cards=dealer_cards,
        player_score=new_score,
        dealer_score=dealer_score,
        status=status,
        message=message
    )


@router.post("/stand", summary="Завершить ход", response_model=GameAction)
async def stand(
    game_id: Annotated[int, Query(description="ID игры")],
    game_crud: GameSessionCRUD = Depends(),
    blackjack_service = Depends(get_blackjack_service),
) -> GameAction:
    """
    Игрок завершает свой ход.
    
    Дилер добирает карты. Определяется результат игры (win/lose/draw).
    """
    # Get game session
    game_session = await game_crud.get_by_id(game_id)
    if not game_session:
        raise HTTPException(status_code=404, detail="Игра не найдена")
    
    if game_session.status != "playing":
        raise HTTPException(status_code=400, detail="Игра уже завершена")
    
    # Dealer plays
    dealer_cards = game_session.dealer_cards.copy()
    dealer_cards, dealer_score = blackjack_service.dealer_play(dealer_cards)
    
    # Determine winner
    player_score = game_session.player_score
    status, message = blackjack_service.determine_winner(player_score, dealer_score)
    
    # Update game session
    await game_crud.update(
        game_id=game_id,
        dealer_cards=dealer_cards,
        dealer_score=dealer_score,
        status=status
    )
    
    return GameAction(
        game_id=game_id,
        player_cards=game_session.player_cards,
        dealer_cards=dealer_cards,
        player_score=player_score,
        dealer_score=dealer_score,
        status=status,
        message=message
    )


@router.get("/status", summary="Получить состояние игры", response_model=GameStatus)
async def get_status(
    game_id: Annotated[int, Query(description="ID игры")],
    game_crud: GameSessionCRUD = Depends(),
) -> GameStatus:
    """
    Получить текущее состояние сессии: карты игрока и дилера, очки, статус.
    """
    # Get game session
    game_session = await game_crud.get_by_id(game_id)
    if not game_session:
        raise HTTPException(status_code=404, detail="Игра не найдена")
    
    return GameStatus(
        game_id=game_session.id,
        player_cards=game_session.player_cards,
        dealer_cards=game_session.dealer_cards,
        player_score=game_session.player_score,
        dealer_score=game_session.dealer_score,
        status=game_session.status,
        created_at=game_session.created_at,
        updated_at=game_session.updated_at
    ) 