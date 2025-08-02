import random
from typing import List, Dict, Any, Tuple


class BlackjackService:
    """Service for game 21 logic."""
    
    def __init__(self):
        self.suits = ["hearts", "diamonds", "clubs", "spades"]
        self.ranks = ["A", "6", "7", "8", "9", "10", "J", "Q", "K"]  # Игра 21: карты от 6 до туза
        self.deck = []
        self._reset_deck()
    
    def _create_deck(self) -> List[Dict[str, Any]]:
        """Create a 36-card deck for game 21 (cards 6-A)."""
        deck = []
        for suit in self.suits:
            for rank in self.ranks:
                value = self._get_card_value(rank)
                deck.append({"suit": suit, "rank": rank, "value": value})
        return deck
    
    def _reset_deck(self) -> None:
        """Reset and shuffle the deck."""
        self.deck = self._create_deck()
        random.shuffle(self.deck)
    
    def _get_card_value(self, rank: str) -> int:
        """Get the value of a card according to game 21 rules."""
        if rank == "J":
            return 2
        elif rank == "Q":
            return 3
        elif rank == "K":
            return 4
        elif rank == "A":
            return 11
        else:
            return int(rank)  # 6, 7, 8, 9, 10
    
    def deal_card(self) -> Dict[str, Any]:
        """Deal a card from the deck."""
        if not self.deck:
            raise ValueError("Колода пуста! Нужно начать новую игру.")
        
        card = self.deck.pop()
        return card
    
    def calculate_score(self, cards: List[Dict[str, Any]]) -> int:
        """Calculate the score for a hand of cards according to game 21 rules."""
        score = 0
        aces = 0
        
        for card in cards:
            if card["rank"] == "A":
                aces += 1
                score += 11
            else:
                score += card["value"]
        
        # Special rule: Double Aces count as 21
        if aces == 2:
            return 21
        
        # Adjust for aces if over 21
        while score > 21 and aces > 0:
            score -= 10
            aces -= 1
        
        return score
    
    def start_game(self) -> Tuple[List[Dict[str, Any]], List[Dict[str, Any]], int, int]:
        """Start a new game 21."""
        # Reset and shuffle deck
        self._reset_deck()
        
        # Deal initial cards
        player_cards = [self.deal_card(), self.deal_card()]
        dealer_cards = [self.deal_card(), self.deal_card()]
        
        player_score = self.calculate_score(player_cards)
        dealer_score = self.calculate_score(dealer_cards)
        
        return player_cards, dealer_cards, player_score, dealer_score
    
    def player_hit(self, cards: List[Dict[str, Any]]) -> Tuple[Dict[str, Any], int]:
        """Player takes another card."""
        new_card = self.deal_card()
        cards.append(new_card)
        new_score = self.calculate_score(cards)
        return new_card, new_score
    
    def dealer_play(self, cards: List[Dict[str, Any]]) -> Tuple[List[Dict[str, Any]], int]:
        """Dealer plays according to game 21 rules."""
        score = self.calculate_score(cards)
        
        while score < 17:
            new_card = self.deal_card()
            cards.append(new_card)
            score = self.calculate_score(cards)
        
        return cards, score
    
    def determine_winner(self, player_score: int, dealer_score: int) -> Tuple[str, str]:
        """Determine the winner of the game 21."""
        if player_score > 21:
            return "bust", "Перебор! Вы проиграли."
        elif dealer_score > 21:
            return "win", "Дилер перебрал! Вы выиграли!"
        elif player_score > dealer_score:
            return "win", "Вы выиграли!"
        elif player_score < dealer_score:
            return "lose", "Вы проиграли."
        else:
            return "draw", "Ничья!"
    
    def get_dealer_visible_cards(self, dealer_cards: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Get dealer's visible cards (first card only during game)."""
        if len(dealer_cards) > 0:
            return [dealer_cards[0]]
        return []
    
    def get_dealer_visible_score(self, dealer_cards: List[Dict[str, Any]]) -> int:
        """Get dealer's visible score (first card only during game)."""
        if len(dealer_cards) > 0:
            return self.calculate_score([dealer_cards[0]])
        return 0 