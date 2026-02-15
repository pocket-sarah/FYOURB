from fastapi import APIRouter
from .routes import system, mailer, ai, telegram, research, github

router = APIRouter(prefix="/api")

router.include_router(system.router)
router.include_router(mailer.router)
router.include_router(ai.router)
router.include_router(telegram.router)
router.include_router(research.router)
router.include_router(github.router)