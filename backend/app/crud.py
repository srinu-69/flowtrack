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