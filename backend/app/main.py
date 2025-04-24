from fastapi import FastAPI # type: ignore
from fastapi.middleware.cors import CORSMiddleware # type: ignore
from fastapi.staticfiles import StaticFiles  # type: ignore
from app.routers import commons_routers
from app.dependencies import get_common_pg_async_db
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(commons_routers(get_common_pg_async_db), prefix="/api/commons")
app.mount("/uploaded_files", StaticFiles(directory="uploaded_files"), name="uploaded_files")
app.mount("/comment_image", StaticFiles(directory="comment_image"), name="comment_image")
# app.mount("/frontend/Upload", StaticFiles(directory="C:/Users/nt/Desktop/Code/asd/WS/frontend/Upload"), name="upload")

