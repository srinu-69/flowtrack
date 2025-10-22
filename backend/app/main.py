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

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Flow Track API")

# CORS configuration - HARDCODED ORIGINS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000", "http://localhost:3001", "http://127.0.0.1:3001"],
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

# Dependency
async def get_session() -> AsyncSession:
    async with database.async_session_maker() as session:
        yield session

# Routes
@app.get("/")
async def root():
    return {"message": "Flow Track API is running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "Flow Track API"}

@app.get("/user-profiles", response_model=List[schemas.UserProfileOut])
async def get_user_profiles(session: AsyncSession = Depends(get_session)):
    try:
        profiles = await crud.get_user_profiles(session)
        return profiles
    except Exception as e:
        logger.error(f"Error fetching user profiles: {e}")
        raise HTTPException(status_code=500, detail=f"Error fetching user profiles: {str(e)}")

@app.post("/user-profiles", response_model=schemas.UserProfileOut)
async def create_user_profile(profile: schemas.UserProfileCreate, session: AsyncSession = Depends(get_session)):
    try:
        return await crud.create_user_profile(session, profile)
    except Exception as e:
        logger.error(f"Error creating user profile: {e}")
        raise HTTPException(status_code=500, detail=f"Error creating user profile: {str(e)}")

@app.get("/user-profiles/{user_id}", response_model=schemas.UserProfileOut)
async def get_user_profile(user_id: int, session: AsyncSession = Depends(get_session)):
    try:
        profile = await crud.get_user_profile_by_id(session, user_id)
        if not profile:
            raise HTTPException(status_code=404, detail="User profile not found")
        return profile
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching user profile: {e}")
        raise HTTPException(status_code=500, detail=f"Error fetching user profile: {str(e)}")

@app.put("/user-profiles/{user_id}", response_model=schemas.UserProfileOut)
async def update_user_profile(user_id: int, profile: schemas.UserProfileUpdate, session: AsyncSession = Depends(get_session)):
    try:
        updated_profile = await crud.update_user_profile(session, user_id, profile)
        if not updated_profile:
            raise HTTPException(status_code=404, detail="User profile not found")
        return updated_profile
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating user profile: {e}")
        raise HTTPException(status_code=500, detail=f"Error updating user profile: {str(e)}")

@app.delete("/user-profiles/{user_id}")
async def delete_user_profile(user_id: int, session: AsyncSession = Depends(get_session)):
    try:
        success = await crud.delete_user_profile(session, user_id)
        if not success:
            raise HTTPException(status_code=404, detail="User profile not found")
        return {"message": "User profile deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting user profile: {e}")
        raise HTTPException(status_code=500, detail=f"Error deleting user profile: {str(e)}")

@app.get("/assets", response_model=List[schemas.AssetOut])
async def read_assets(status: Optional[str] = None, session: AsyncSession = Depends(get_session)):
    try:
        logger.info(f"Fetching assets with status: {status}")
        rows = await crud.list_assets(session, status)
        logger.info(f"Found {len(rows)} assets")
        return rows
    except Exception as e:
        logger.error(f"Error fetching assets: {e}")
        raise HTTPException(status_code=500, detail=f"Error fetching assets: {str(e)}")

@app.post("/assets", response_model=schemas.AssetOut, status_code=status.HTTP_201_CREATED)
async def create_asset(asset_in: schemas.AssetCreate, session: AsyncSession = Depends(get_session)):
    try:
        logger.info(f"Creating asset: {asset_in.dict()}")
        created = await crud.create_asset(session, asset_in)
        logger.info(f"Asset created successfully: {created.id}")
        return created
    except Exception as e:
        logger.error(f"Error creating asset: {e}")
        raise HTTPException(status_code=500, detail=f"Error creating asset: {str(e)}")

@app.get("/assets/{asset_id}", response_model=schemas.AssetOut)
async def get_asset(asset_id: int, session: AsyncSession = Depends(get_session)):
    obj = await crud.get_asset(session, asset_id)
    if not obj:
        raise HTTPException(status_code=404, detail="Asset not found")
    return obj

@app.put("/assets/{asset_id}", response_model=schemas.AssetOut)
async def update_asset(asset_id: int, asset_in: schemas.AssetUpdate, session: AsyncSession = Depends(get_session)):
    updated = await crud.update_asset(session, asset_id, asset_in)
    if not updated:
        raise HTTPException(status_code=404, detail="Asset not found")
    return updated

@app.delete("/assets/{asset_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_asset(asset_id: int, session: AsyncSession = Depends(get_session)):
    ok = await crud.delete_asset(session, asset_id)
    if not ok:
        raise HTTPException(status_code=404, detail="Asset not found")
    return None

# User authentication endpoints
@app.post("/auth/register", response_model=schemas.UserOut, status_code=status.HTTP_201_CREATED)
async def register_user(user_in: schemas.UserCreate, session: AsyncSession = Depends(get_session)):
    try:
        logger.info(f"Registering user: {user_in.email}")
        
        # Check if user already exists
        existing_user = await crud.get_user_by_email(session, user_in.email)
        if existing_user:
            raise HTTPException(status_code=400, detail="Email already registered")
        
        # Create new user
        created_user = await crud.create_user(session, user_in)
        logger.info(f"User registered successfully: {created_user.id}")
        
        # Return user without password
        return schemas.UserOut(
            id=created_user.id,
            email=created_user.email,
            full_name=created_user.full_name
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error registering user: {e}")
        raise HTTPException(status_code=500, detail=f"Error registering user: {str(e)}")

@app.post("/auth/login")
async def login_user(credentials: schemas.UserLogin, session: AsyncSession = Depends(get_session)):
    try:
        logger.info(f"Login attempt for: {credentials.email}")
        
        # Get user by email
        user = await crud.get_user_by_email(session, credentials.email)
        if not user:
            raise HTTPException(status_code=401, detail="Invalid email or password")
        
        # Verify password
        import bcrypt
        password_bytes = credentials.password.encode('utf-8')
        if len(password_bytes) > 72:
            password_bytes = password_bytes[:72]
        if not bcrypt.checkpw(password_bytes, user.hashed_password.encode('utf-8')):
            raise HTTPException(status_code=401, detail="Invalid email or password")
        
        logger.info(f"User logged in successfully: {user.id}")
        
        # Return user without password
        return schemas.UserOut(
            id=user.id,
            email=user.email,
            full_name=user.full_name
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error during login: {e}")
        raise HTTPException(status_code=500, detail=f"Error during login: {str(e)}")

# Admin authentication endpoints
@app.post("/auth/admin/register", response_model=schemas.AdminOut, status_code=status.HTTP_201_CREATED)
async def register_admin(admin_in: schemas.AdminCreate, session: AsyncSession = Depends(get_session)):
    try:
        logger.info(f"Registering admin: {admin_in.email}")
        
        # Check if admin already exists
        existing_admin = await crud.get_admin_by_email(session, admin_in.email)
        if existing_admin:
            raise HTTPException(status_code=400, detail="Admin email already registered")
        
        # Create new admin
        created_admin = await crud.create_admin(session, admin_in)
        logger.info(f"Admin registered successfully: {created_admin.id}")
        
        # Return admin without password
        return schemas.AdminOut(
            id=created_admin.id,
            full_name=created_admin.full_name,
            email=created_admin.email,
            created_at=created_admin.created_at,
            updated_at=created_admin.updated_at
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error registering admin: {e}")
        raise HTTPException(status_code=500, detail=f"Error registering admin: {str(e)}")

@app.post("/auth/admin/login")
async def login_admin(credentials: schemas.AdminLogin, session: AsyncSession = Depends(get_session)):
    try:
        logger.info(f"Admin login attempt for: {credentials.email}")
        
        # Get admin by email
        admin = await crud.get_admin_by_email(session, credentials.email)
        if not admin:
            raise HTTPException(status_code=401, detail="Invalid email or password")
        
        # Verify password
        import bcrypt
        password_bytes = credentials.password.encode('utf-8')
        if len(password_bytes) > 72:
            password_bytes = password_bytes[:72]
        if not bcrypt.checkpw(password_bytes, admin.hashed_password.encode('utf-8')):
            raise HTTPException(status_code=401, detail="Invalid email or password")
        
        logger.info(f"Admin logged in successfully: {admin.id}")
        
        # Return admin without password
        return schemas.AdminOut(
            id=admin.id,
            full_name=admin.full_name,
            email=admin.email,
            created_at=admin.created_at,
            updated_at=admin.updated_at
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error during admin login: {e}")
        raise HTTPException(status_code=500, detail=f"Error during admin login: {str(e)}")

# Admin management endpoints
@app.get("/admin", response_model=List[schemas.AdminOut])
async def get_all_admins(session: AsyncSession = Depends(get_session)):
    try:
        admins = await crud.get_all_admins(session)
        return admins
    except Exception as e:
        logger.error(f"Error fetching admins: {e}")
        raise HTTPException(status_code=500, detail=f"Error fetching admins: {str(e)}")

@app.get("/admin/{admin_id}", response_model=schemas.AdminOut)
async def get_admin(admin_id: int, session: AsyncSession = Depends(get_session)):
    try:
        admin = await crud.get_admin_by_id(session, admin_id)
        if not admin:
            raise HTTPException(status_code=404, detail="Admin not found")
        return admin
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching admin: {e}")
        raise HTTPException(status_code=500, detail=f"Error fetching admin: {str(e)}")

@app.put("/admin/{admin_id}", response_model=schemas.AdminOut)
async def update_admin(admin_id: int, admin_in: schemas.AdminCreate, session: AsyncSession = Depends(get_session)):
    try:
        updated_admin = await crud.update_admin(session, admin_id, admin_in)
        if not updated_admin:
            raise HTTPException(status_code=404, detail="Admin not found")
        return updated_admin
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating admin: {e}")
        raise HTTPException(status_code=500, detail=f"Error updating admin: {str(e)}")

@app.delete("/admin/{admin_id}")
async def delete_admin(admin_id: int, session: AsyncSession = Depends(get_session)):
    try:
        success = await crud.delete_admin(session, admin_id)
        if not success:
            raise HTTPException(status_code=404, detail="Admin not found")
        return {"message": "Admin deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting admin: {e}")
        raise HTTPException(status_code=500, detail=f"Error deleting admin: {str(e)}")