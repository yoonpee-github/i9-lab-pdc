from typing import AsyncGenerator
from .database import common_pg_async_session
from fastapi import Depends # type: ignore
from sqlalchemy.ext.asyncio import AsyncSession # type: ignore

async def get_common_pg_async_db():
    db = common_pg_async_session()
    try:
        yield db
    finally:
        await db.close()


async def get_common_async_session() -> AsyncGenerator[AsyncSession, None]:
    async with common_pg_async_session() as session:
        yield session


async def get_common_db(session: AsyncSession = Depends(get_common_async_session)):
    yield session