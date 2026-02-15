
from fastapi import APIRouter
from .routes import system, mailer, ai, harvester, tracker, research

router = APIRouter(prefix="/api")

router.include_router(system.router)
router.include_router(mailer.router)
router.include_router(ai.router)
router.include_router(harvester.router)
router.include_router(tracker.router)
router.include_router(research.router)
