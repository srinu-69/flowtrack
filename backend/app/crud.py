# from sqlalchemy import select
# from sqlalchemy.ext.asyncio import AsyncSession
# from typing import List, Optional
# from datetime import datetime
# from . import models, schemas


# def _coerce_enum_value(model_enum, incoming):
#     """
#     Coerce incoming value (str or Enum) to the DB enum string value.
#     Handles Pydantic enums, raw strings (both names and values).
#     """
#     if incoming is None:
#         return None

#     # If it's an enum instance, use its value
#     if hasattr(incoming, "value"):
#         incoming = incoming.value

#     if isinstance(incoming, str):
#         # Try as enum value
#         try:
#             return model_enum(incoming).value
#         except ValueError:
#             # Try as enum member name
#             try:
#                 return model_enum[incoming.replace(" ", "")].value
#             except Exception:
#                 return incoming  # fallback to string

#     return str(incoming)


# async def get_asset(session: AsyncSession, asset_id: str) -> Optional[models.Asset]:
#     q = select(models.Asset).where(models.Asset.id == asset_id)
#     res = await session.execute(q)
#     return res.scalars().first()


# async def list_assets(session: AsyncSession, status: Optional[str] = None) -> List[models.Asset]:
#     q = select(models.Asset)
#     if status:
#         q = q.where(models.Asset.status == status)
#     q = q.order_by(models.Asset.open_date.desc())
#     res = await session.execute(q)
#     return res.scalars().all()


# def _map_status_to_db(incoming: Optional[str]) -> Optional[str]:
#     """Map incoming status strings (from frontend/schemas) to DB StatusEnum values.

#     The frontend/schema use different status names (e.g. 'active', 'maintenance', 'inactive').
#     The DB model expects 'Open', 'Assigned', 'Closed'. Map commonly used values accordingly.
#     """
#     if incoming is None:
#         return None
#     # coerce enum-like inputs first
#     if hasattr(incoming, "value"):
#         incoming_val = incoming.value
#     else:
#         incoming_val = str(incoming)

#     # direct match to DB enum value
#     try:
#         return models.StatusEnum(incoming_val).value
#     except Exception:
#         pass

#     # common mapping from older/frontend statuses to DB statuses
#     mapping = {
#         "active": models.StatusEnum.Open.value,
#         "maintenance": models.StatusEnum.Assigned.value,
#         "inactive": models.StatusEnum.Closed.value,
#         "open": models.StatusEnum.Open.value,
#         "assigned": models.StatusEnum.Assigned.value,
#         "closed": models.StatusEnum.Closed.value,
#     }
#     key = incoming_val.lower()
#     return mapping.get(key, incoming_val)


# def _map_type_to_db(incoming: Optional[str]) -> Optional[str]:
#     """Map frontend type values to DB AssetTypeEnum values.

#     Frontend may send 'Network Issue' or 'NetworkIssue'; DB expects 'Network'.
#     """
#     if incoming is None:
#         return None
#     if hasattr(incoming, "value"):
#         incoming_val = incoming.value
#     else:
#         incoming_val = str(incoming)

#     # direct match
#     try:
#         return models.AssetTypeEnum(incoming_val).value
#     except Exception:
#         pass

#     # normalize names without spaces
#     name_key = incoming_val.replace(" ", "").lower()
#     type_map = {
#         "laptop": models.AssetTypeEnum.Laptop.value,
#         "charger": models.AssetTypeEnum.Charger.value,
#         "networkissue": models.AssetTypeEnum.Network.value,
#         "network": models.AssetTypeEnum.Network.value,
#     }
#     return type_map.get(name_key, incoming_val)


# async def create_asset(session: AsyncSession, asset_in: schemas.AssetCreate) -> models.Asset:
#     obj = models.Asset(
#         email=asset_in.email,
#         type=_map_type_to_db(asset_in.type),
#         location=_coerce_enum_value(models.LocationEnum, asset_in.location),
#         status=_map_status_to_db(asset_in.status),
#         open_date=datetime.utcnow(),
#     )
#     session.add(obj)
#     await session.commit()
#     await session.refresh(obj)
#     return obj


# async def delete_asset(session: AsyncSession, asset_id: str) -> bool:
#     obj = await get_asset(session, asset_id)
#     if not obj:
#         return False
#     await session.delete(obj)
#     await session.commit()
#     return True
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional
from datetime import datetime
from . import models, schemas
import bcrypt

def get_password_hash(password: str) -> str:
    """Hash a password using bcrypt"""
    password_bytes = password.encode('utf-8')
    if len(password_bytes) > 72:
        password_bytes = password_bytes[:72]
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password_bytes, salt)
    return hashed.decode('utf-8')


# Helpers to normalize inputs to DB-expected strings
def _normalize_type(incoming) -> Optional[str]:
    if incoming is None:
        return None
    val = incoming.value if hasattr(incoming, 'value') else str(incoming)
    val = str(val).strip()
    key = ''.join(ch for ch in val.lower() if ch.isalnum())
    if key in ('laptop',):
        return 'Laptop'
    if key in ('charger',):
        return 'Charger'
    if key in ('networkissue', 'network', 'networkissue'):
        # DB expects 'Network Issue' (with space)
        return 'Network Issue'
    # fallback: return original trimmed value
    return val


def _normalize_status(incoming) -> str:
    # Map frontend status values to DB status values: Open/Assigned/Closed
    if incoming is None:
        return 'Open'
    val = incoming.value if hasattr(incoming, 'value') else str(incoming)
    val = str(val).strip()
    key = ''.join(ch for ch in val.lower() if ch.isalnum())
    if key in ('active', 'open'):
        return 'Open'
    if key in ('maintenance', 'assigned'):
        return 'Assigned'
    if key in ('inactive', 'closed'):
        return 'Closed'
    return val


def _normalize_location(incoming) -> Optional[str]:
    if incoming is None:
        return None
    val = incoming.value if hasattr(incoming, 'value') else str(incoming)
    val = str(val).strip()
    key = ''.join(ch for ch in val.lower() if ch.isalnum())
    if key in ('wfo', 'office', 'onsite'):
        return 'WFO'
    if key in ('wfh', 'home'):
        return 'WFH'
    return val

async def get_asset(session: AsyncSession, asset_id: int) -> Optional[models.Asset]:
    q = select(models.Asset).where(models.Asset.id == asset_id)
    res = await session.execute(q)
    return res.scalars().first()

async def list_assets(session: AsyncSession, status: Optional[str] = None) -> List[models.Asset]:
    q = select(models.Asset)
    if status:
        # Map frontend status to database status
        status_map = {
            "active": "Open",
            "maintenance": "Assigned", 
            "inactive": "Closed"
        }
        db_status = status_map.get(status, status)
        q = q.where(models.Asset.status == db_status)
    q = q.order_by(models.Asset.assigned_date.desc())
    res = await session.execute(q)
    return res.scalars().all()

async def create_asset(session: AsyncSession, asset_in: schemas.AssetCreate) -> models.Asset:
    # Normalize incoming values to what the DB check constraints expect
    type_val = _normalize_type(asset_in.type)
    status_val = _normalize_status(asset_in.status)
    loc_val = _normalize_location(asset_in.location) or 'WFO'

    obj = models.Asset(
        email_id=asset_in.email,
        asset_type=type_val,
        location=loc_val,
        status=status_val,
        description=asset_in.description,
        assigned_date=datetime.utcnow(),
    )
    session.add(obj)
    await session.commit()
    await session.refresh(obj)
    return obj

async def update_asset(session: AsyncSession, asset_id: int, asset_in: schemas.AssetUpdate) -> Optional[models.Asset]:
    obj = await get_asset(session, asset_id)
    if not obj:
        return None
    
    # Use normalization helpers for updates as well
    
    if asset_in.email is not None:
        obj.email_id = asset_in.email
    if asset_in.type is not None:
        obj.asset_type = _normalize_type(asset_in.type)
    if asset_in.location is not None:
        obj.location = _normalize_location(asset_in.location)
    if asset_in.status is not None:
        obj.status = _normalize_status(asset_in.status)
    if asset_in.description is not None:
        obj.description = asset_in.description
    
    await session.commit()
    await session.refresh(obj)
    return obj

async def delete_asset(session: AsyncSession, asset_id: int) -> bool:
    obj = await get_asset(session, asset_id)
    if not obj:
        return False
    await session.delete(obj)
    await session.commit()
    return True


async def create_user(session: AsyncSession, user_in: schemas.UserCreate) -> models.User:
    # Hash password with bcrypt - ensure password is bytes and not too long
    password_bytes = user_in.password.encode('utf-8')
    if len(password_bytes) > 72:
        password_bytes = password_bytes[:72]
    salt = bcrypt.gensalt()
    hashed_password = bcrypt.hashpw(password_bytes, salt).decode('utf-8')
    
    user = models.User(
        full_name=user_in.full_name,
        email=user_in.email,
        hashed_password=hashed_password,
    )
    session.add(user)
    await session.commit()
    await session.refresh(user)
    return user

async def get_user_by_email(session: AsyncSession, email: str) -> Optional[models.User]:
    q = select(models.User).where(models.User.email == email)
    res = await session.execute(q)
    return res.scalars().first()

# Department mapping from frontend to database
DEPARTMENT_MAPPING = {
    "Frontend": "Flow Track",
    "Backend": "Flow Track", 
    "Marketing": "Marketing",
    "AI/ML": "Flow Track",
    "DevOps": "DevOps",
    "Testing": "Testing",
    "FlowTrack": "Flow Track",
    "NetWork": "Flow Track",
    "Hr": "HR"
}

# User Profile CRUD functions
async def create_user_profile(session: AsyncSession, profile_in: schemas.UserProfileCreate) -> models.UserProfile:
    # Map frontend department to valid database department
    mapped_department = DEPARTMENT_MAPPING.get(profile_in.department, "Flow Track")
    
    profile = models.UserProfile(
        user_id=profile_in.user_id,
        full_name=profile_in.full_name,
        email=profile_in.email,
        mobile_number=profile_in.mobile_number,
        role=profile_in.role,
        department=mapped_department,
        date_of_birth=profile_in.date_of_birth,
        user_status=profile_in.user_status
    )
    session.add(profile)
    await session.commit()
    await session.refresh(profile)
    return profile

async def get_user_profiles(session: AsyncSession) -> List[models.UserProfile]:
    q = select(models.UserProfile)
    res = await session.execute(q)
    return res.scalars().all()

async def get_user_profile_by_id(session: AsyncSession, user_id: int) -> Optional[models.UserProfile]:
    q = select(models.UserProfile).where(models.UserProfile.user_id == user_id)
    res = await session.execute(q)
    return res.scalars().first()

async def update_user_profile(session: AsyncSession, user_id: int, profile_in: schemas.UserProfileUpdate) -> Optional[models.UserProfile]:
    q = select(models.UserProfile).where(models.UserProfile.user_id == user_id)
    res = await session.execute(q)
    profile = res.scalars().first()
    
    if not profile:
        return None
    
    for field, value in profile_in.dict(exclude_unset=True).items():
        if field == "department" and value:
            # Map frontend department to valid database department
            mapped_department = DEPARTMENT_MAPPING.get(value, "Flow Track")
            setattr(profile, field, mapped_department)
        else:
            setattr(profile, field, value)
    
    await session.commit()
    await session.refresh(profile)
    return profile

async def delete_user_profile(session: AsyncSession, user_id: int) -> bool:
    q = select(models.UserProfile).where(models.UserProfile.user_id == user_id)
    res = await session.execute(q)
    profile = res.scalars().first()
    
    if not profile:
        return False
    
    await session.delete(profile)
    await session.commit()
    return True

# Admin CRUD functions
async def create_admin(session: AsyncSession, admin_in: schemas.AdminCreate) -> models.Admin:
    hashed_password = get_password_hash(admin_in.password)
    admin = models.Admin(
        full_name=admin_in.full_name,
        email=admin_in.email,
        hashed_password=hashed_password
    )
    session.add(admin)
    await session.commit()
    await session.refresh(admin)
    return admin

async def get_admin_by_email(session: AsyncSession, email: str) -> Optional[models.Admin]:
    q = select(models.Admin).where(models.Admin.email == email)
    res = await session.execute(q)
    return res.scalars().first()

async def get_admin_by_id(session: AsyncSession, admin_id: int) -> Optional[models.Admin]:
    q = select(models.Admin).where(models.Admin.id == admin_id)
    res = await session.execute(q)
    return res.scalars().first()

async def get_all_admins(session: AsyncSession) -> List[models.Admin]:
    q = select(models.Admin)
    res = await session.execute(q)
    return res.scalars().all()

async def update_admin(session: AsyncSession, admin_id: int, admin_in: schemas.AdminCreate) -> Optional[models.Admin]:
    q = select(models.Admin).where(models.Admin.id == admin_id)
    res = await session.execute(q)
    admin = res.scalars().first()
    
    if not admin:
        return None
    
    admin.full_name = admin_in.full_name
    admin.email = admin_in.email
    admin.hashed_password = get_password_hash(admin_in.password)
    
    await session.commit()
    await session.refresh(admin)
    return admin

async def delete_admin(session: AsyncSession, admin_id: int) -> bool:
    q = select(models.Admin).where(models.Admin.id == admin_id)
    res = await session.execute(q)
    admin = res.scalars().first()
    
    if not admin:
        return False
    
    await session.delete(admin)
    await session.commit()
    return True