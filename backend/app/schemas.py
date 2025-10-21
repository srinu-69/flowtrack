# from pydantic import BaseModel, EmailStr, Field
# from typing import Optional
# from datetime import datetime
# from enum import Enum

# # Enums matching your DB values
# class AssetTypeEnum(str, Enum):
#     Laptop = "Laptop"
#     Charger = "Charger"
#     NetworkIssue = "Network Issue"

# class LocationEnum(str, Enum):
#     WFO = "WFO"
#     WFH = "WFH"

# class StatusEnum(str, Enum):
#     active = "active"
#     maintenance = "maintenance"
#     inactive = "inactive"

# # Base model for asset input
# class AssetBase(BaseModel):
#     email: EmailStr
#     type: AssetTypeEnum
#     location: Optional[LocationEnum] = LocationEnum.WFO
#     status: Optional[StatusEnum] = StatusEnum.active
#     description: Optional[str] = None

# class AssetCreate(AssetBase):
#     pass

# class AssetUpdate(BaseModel):
#     email: Optional[EmailStr] = None
#     type: Optional[AssetTypeEnum] = None
#     location: Optional[LocationEnum] = None
#     status: Optional[StatusEnum] = None
#     description: Optional[str] = None

# # Output model for responses
# class AssetOut(BaseModel):
#     id: int
#     email: EmailStr
#     type: AssetTypeEnum
#     location: Optional[LocationEnum] = None
#     status: StatusEnum          # Use correct enum
#     open_date: datetime = Field(..., alias="openDate")
#     close_date: Optional[datetime] = Field(None, alias="closeDate")
#     description: Optional[str] = None

#     class Config:
#         orm_mode = True
#         allow_population_by_field_name = True

from pydantic import BaseModel, EmailStr, Field, field_validator
from typing import Optional
from datetime import datetime
from enum import Enum

# Enums for frontend
class AssetTypeEnum(str, Enum):
    Laptop = "Laptop"
    Charger = "Charger"
    NetworkIssue = "Network Issue"

class LocationEnum(str, Enum):
    WFO = "WFO"
    WFH = "WFH"

class StatusEnum(str, Enum):
    active = "active"
    maintenance = "maintenance"
    inactive = "inactive"

# Base model for asset input
class AssetBase(BaseModel):
    email: EmailStr
    type: AssetTypeEnum
    location: Optional[LocationEnum] = LocationEnum.WFO
    status: Optional[StatusEnum] = StatusEnum.active
    description: Optional[str] = None

    @field_validator("type", mode="before")
    def coerce_type(cls, v):
        if isinstance(v, AssetTypeEnum):
            return v
        if not isinstance(v, str):
            raise ValueError(f"Invalid asset type: {v}")
        s = v.strip()
        # direct match by value (case-insensitive)
        for member in AssetTypeEnum:
            if s.lower() == member.value.lower():
                return member
        # match by enum name (case-insensitive, allow spacing differences)
        compact = ''.join(ch for ch in s.lower() if ch.isalnum())
        for member in AssetTypeEnum:
            if compact == ''.join(ch for ch in member.name.lower() if ch.isalnum()):
                return member
        # tolerate common variations: e.g. 'network issue', 'Network issue', 'networkissue'
        for member in AssetTypeEnum:
            member_compact = ''.join(ch for ch in member.value.lower() if ch.isalnum())
            if compact == member_compact:
                return member
        raise ValueError(f"Invalid asset type: {v}")

    @field_validator("location", mode="before")
    def coerce_location(cls, v):
        if v is None:
            return v
        if isinstance(v, LocationEnum):
            return v
        if not isinstance(v, str):
            raise ValueError(f"Invalid location: {v}")
        s = v.strip()
        try:
            return LocationEnum(s)
        except Exception:
            pass
        try:
            return LocationEnum[s]
        except Exception:
            pass
        ss = s.replace('-', '').replace('_', '').upper()
        for member in LocationEnum:
            if ss == member.value.replace('-', '').replace('_', '').upper() or ss == member.name.upper():
                return member
        raise ValueError(f"Invalid location: {v}")

    @field_validator("status", mode="before")
    def coerce_status(cls, v):
        if v is None:
            return v
        if isinstance(v, StatusEnum):
            return v
        if not isinstance(v, str):
            raise ValueError(f"Invalid status: {v}")
        s = v.strip()
        try:
            return StatusEnum(s)
        except Exception:
            pass
        try:
            return StatusEnum[s]
        except Exception:
            pass
        ss = ''.join(ch for ch in s.lower() if ch.isalnum())
        for member in StatusEnum:
            if ss == ''.join(ch for ch in member.value.lower() if ch.isalnum()) or ss == member.name.lower():
                return member
        raise ValueError(f"Invalid status: {v}")

class AssetCreate(AssetBase):
    pass

class AssetUpdate(BaseModel):
    email: Optional[EmailStr] = None
    type: Optional[AssetTypeEnum] = None
    location: Optional[LocationEnum] = None
    status: Optional[StatusEnum] = None
    description: Optional[str] = None

# Output model for responses
class AssetOut(BaseModel):
    id: int
    email_id: str
    asset_type: str
    location: Optional[str] = None
    status: str
    description: Optional[str] = None
    assigned_date: Optional[datetime] = None
    return_date: Optional[datetime] = None

    class Config:
        from_attributes = True
        populate_by_name = True

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: str | None = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserOut(BaseModel):
    id: int
    email: EmailStr
    full_name: str | None

    class Config:
        from_attributes = True