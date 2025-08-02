from fastapi.routing import APIRouter

from api.v1 import dummy, game

api_router = APIRouter()
# api_router.include_router(dummy.router)
api_router.include_router(game.router)
