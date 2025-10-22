# from fastapi import FastAPI, Depends, HTTPException, status
# from fastapi.middleware.cors import CORSMiddleware
# from sqlalchemy.ext.asyncio import AsyncSession
# from typing import List, Optional

# from . import models, schemas, crud, database, config

# app = FastAPI(title="Flow Track API")

# # CORS
# def _normalize_allowed_origins(origins):
#     """Ensure allowed_origins is a list of origin strings.

#     Accepts either a list (already correct) or a single comma-separated
#     string (from environment) and returns a list.
#     """
#     if origins is None:
#         return []
#     # If already a list/tuple, return as list
#     if isinstance(origins, (list, tuple)):
#         return list(origins)
#     # If it's a string, split on commas and strip whitespace
#     if isinstance(origins, str):
#         return [o.strip() for o in origins.split(",") if o.strip()]
#     # Fallback: coerce to string and return single-item list
#     return [str(origins)]

# allowed_origins = _normalize_allowed_origins(config.settings.allowed_origins)

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=allowed_origins,
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# # create tables automatically for quick dev (optional)
# @app.on_event("startup")
# async def startup():
#     # Create tables (for dev). In production use alembic migrations.
#     async with database.engine.begin() as conn:
#         await conn.run_sync(models.Base.metadata.create_all)

# # Dependency
# async def get_session() -> AsyncSession:
#     async for s in database.get_session():
#         yield s

# # Routes
# @app.get("/assets", response_model=List[schemas.AssetOut])
# async def read_assets(status: Optional[schemas.StatusEnum] = None, session: AsyncSession = Depends(get_session)):
#     rows = await crud.list_assets(session, status.value if status else None)
#     return rows

# @app.post("/assets", response_model=schemas.AssetOut, status_code=status.HTTP_201_CREATED)
# async def create_asset(asset_in: schemas.AssetCreate, session: AsyncSession = Depends(get_session)):
#     created = await crud.create_asset(session, asset_in)
#     return created

# @app.get("/assets/{asset_id}", response_model=schemas.AssetOut)
# async def get_asset(asset_id: str, session: AsyncSession = Depends(get_session)):
#     obj = await crud.get_asset(session, asset_id)
#     if not obj:
#         raise HTTPException(status_code=404, detail="Asset not found")
#     return obj

# @app.put("/assets/{asset_id}", response_model=schemas.AssetOut)
# async def update_asset(asset_id: str, asset_in: schemas.AssetUpdate, session: AsyncSession = Depends(get_session)):
#     updated = await crud.update_asset(session, asset_id, asset_in)
#     if not updated:
#         raise HTTPException(status_code=404, detail="Asset not found")
#     return updated

# @app.delete("/assets/{asset_id}", status_code=status.HTTP_204_NO_CONTENT)
# async def delete_asset(asset_id: str, session: AsyncSession = Depends(get_session)):
#     ok = await crud.delete_asset(session, asset_id)
#     if not ok:
#         raise HTTPException(status_code=404, detail="Asset not found")
#     return None

from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional
import logging

from . import models, schemas, crud, database

# Logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Flow Track API")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000", "http://127.0.0.1:3000",
        "http://localhost:3001", "http://127.0.0.1:3001"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create tables on startup
@app.on_event("startup")
async def startup():
    try:
        async with database.engine.begin() as conn:
            await conn.run_sync(models.Base.metadata.create_all)
        logger.info("✅ Database tables created successfully")
    except Exception as e:
        logger.error(f"❌ Error creating tables: {e}")

# Unified DB session dependency
async def get_db() -> AsyncSession:
    async with database.async_session_maker() as session:
        yield session

# --- Routes ---

@app.get("/")
async def root():
    return {"message": "Flow Track API is running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "Flow Track API"}

# --- Asset Routes ---
@app.get("/assets", response_model=List[schemas.AssetOut])
async def read_assets(status: Optional[str] = None, user_email: Optional[str] = None, db: AsyncSession = Depends(get_db)):
    try:
        logger.info(f"Fetching assets with status: {status}, user_email: {user_email}")
        rows = await crud.list_assets(db, status, user_email)
        logger.info(f"Found {len(rows)} assets")
        return rows
    except Exception as e:
        logger.error(f"Error fetching assets: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/assets", response_model=schemas.AssetOut, status_code=status.HTTP_201_CREATED)
async def create_asset(asset_in: schemas.AssetCreate, db: AsyncSession = Depends(get_db)):
    try:
        logger.info(f"Creating asset: {asset_in.dict()}")
        created = await crud.create_asset(db, asset_in)
        logger.info(f"Asset created successfully: {created.id}")
        return created
    except Exception as e:
        logger.error(f"Error creating asset: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/assets/{asset_id}", response_model=schemas.AssetOut)
async def get_asset(asset_id: int, db: AsyncSession = Depends(get_db)):
    obj = await crud.get_asset(db, asset_id)
    if not obj:
        raise HTTPException(status_code=404, detail="Asset not found")
    return obj

@app.put("/assets/{asset_id}", response_model=schemas.AssetOut)
async def update_asset(asset_id: int, asset_in: schemas.AssetUpdate, db: AsyncSession = Depends(get_db)):
    updated = await crud.update_asset(db, asset_id, asset_in)
    if not updated:
        raise HTTPException(status_code=404, detail="Asset not found")
    return updated

@app.delete("/assets/{asset_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_asset(asset_id: int, db: AsyncSession = Depends(get_db)):
    ok = await crud.delete_asset(db, asset_id)
    if not ok:
        raise HTTPException(status_code=404, detail="Asset not found")
    return None

# --- User Authentication ---
@app.post("/auth/register", response_model=schemas.UserOut, status_code=status.HTTP_201_CREATED)
async def register_user(user_in: schemas.UserCreate, db: AsyncSession = Depends(get_db)):
    try:
        logger.info(f"Registering user: {user_in.email}")
        existing_user = await crud.get_user_by_email(db, user_in.email)
        if existing_user:
            raise HTTPException(status_code=400, detail="Email already registered")
        created_user = await crud.create_user(db, user_in)
        return schemas.UserOut(id=created_user.id, email=created_user.email, full_name=created_user.full_name)
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error registering user: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/auth/login", response_model=schemas.UserOut)
async def login_user(credentials: schemas.UserLogin, db: AsyncSession = Depends(get_db)):
    import bcrypt
    try:
        user = await crud.get_user_by_email(db, credentials.email)
        if not user:
            raise HTTPException(status_code=401, detail="Invalid email or password")
        password_bytes = credentials.password.encode("utf-8")[:72]  # bcrypt limit
        if not bcrypt.checkpw(password_bytes, user.hashed_password.encode("utf-8")):
            raise HTTPException(status_code=401, detail="Invalid email or password")
        return schemas.UserOut(id=user.id, email=user.email, full_name=user.full_name)
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error during login: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# --- User CRUD ---
@app.get("/users/", response_model=List[schemas.UserProfileResponse])
async def read_users(db: AsyncSession = Depends(get_db)):
    return await crud.get_users(db)

@app.get("/users/{user_id}", response_model=schemas.UserProfileResponse)
async def read_user(user_id: int, db: AsyncSession = Depends(get_db)):
    user = await crud.get_user(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@app.post("/users/", response_model=schemas.UserProfileResponse)
async def create_user(user: schemas.UserProfileCreate, db: AsyncSession = Depends(get_db)):
    return await crud.create_user_profile(db, user)

@app.put("/users/{user_id}", response_model=schemas.UserProfileResponse)
async def update_user(user_id: int, user: schemas.UserProfileUpdate, db: AsyncSession = Depends(get_db)):
    db_user = await crud.get_user(db, user_id)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    return await crud.update_user(db, user_id, user)

@app.delete("/users/{user_id}")
async def delete_user(user_id: int, db: AsyncSession = Depends(get_db)):
    db_user = await crud.get_user(db, user_id)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    return await crud.delete_user(db, user_id)
