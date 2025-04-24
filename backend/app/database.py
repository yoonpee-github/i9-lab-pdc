import os
import pymysql  # type: ignore
from sqlalchemy.orm import declarative_base # type: ignore
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession # type: ignore
from sqlalchemy.orm import sessionmaker # type: ignore
import urllib.parse
from dotenv import load_dotenv # type: ignore

load_dotenv()



# API_KEY=YOUR_API_KEY
# PG_USER_COMMON=postgres
# PG_PASS_COMMON=postgres
# PG_SERVER_COMMON=localhost
# PG_PORT_COMMON=5432
# PG_DB_COMMON=wi
# EMAIL_HOST=xxx
# EMAIL_PORT=xxx
# EMAIL_USERNAME=xxx
# EMAIL_PASSWORD=xxx
# FRONTEND_BASE_URL=http://localhost:3000


PG_USER_COMMON = os.environ.get("PG_USER_COMMON")
PG_PASS_COMMON = urllib.parse.quote_plus(os.environ.get("PG_PASS_COMMON"))
PG_SERVER_COMMON = os.environ.get("PG_SERVER_COMMON")
PG_PORT_COMMON = os.environ.get("PG_PORT_COMMON")
PG_DB_COMMON = os.environ.get("PG_DB_COMMON")


PG_ASYNC_SQLALCHEMY_DATABASE_URL_COMMON = f"mysql+aiomysql://{PG_USER_COMMON}:{PG_PASS_COMMON}@{PG_SERVER_COMMON}:{PG_PORT_COMMON}/{PG_DB_COMMON}"
common_pg_async_engine = create_async_engine(
    PG_ASYNC_SQLALCHEMY_DATABASE_URL_COMMON, echo=True, pool_size=40, max_overflow=0, pool_recycle=1, pool_timeout=1
)
common_pg_async_session = sessionmaker(
    common_pg_async_engine, expire_on_commit=False, class_=AsyncSession
)

Base = declarative_base()



# try:
#     connection = pymysql.connect(
#         host=os.environ.get("PG_SERVER_COMMON"),
#         user=os.environ.get("PG_USER_COMMON"),
#         password=os.environ.get("PG_PASS_COMMON"),
#         database=os.environ.get("PG_DB_COMMON"),
#         port=int(os.environ.get("PG_PORT_COMMON"))
#     )
#     print("Connection successful!")
#     connection.close()
# except Exception as e:
#     print(f"Connection failed: {e}")
