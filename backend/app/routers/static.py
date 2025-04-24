from fastapi import APIRouter, Depends # type: ignore
from sqlalchemy.ext.asyncio import AsyncSession # type: ignore
from typing import AsyncGenerator



def static_routers(db: AsyncGenerator) -> APIRouter:
    router = APIRouter()

    @router.post("/temp")
    async def dummy():
        return {"msg": "temp file uploaded"}

    return router
