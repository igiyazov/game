from .blackjack import BlackjackService


def get_blackjack_service() -> BlackjackService:
    """Get BlackjackService instance."""
    return BlackjackService()
