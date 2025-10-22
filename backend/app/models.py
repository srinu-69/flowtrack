# from datetime import datetime
# from sqlalchemy import (
#     Column,
#     Integer,
#     String,
#     DateTime,
#     ForeignKey,
#     Enum,
# )
# from sqlalchemy.orm import relationship
# from app.database import Base
# import enum


# # --- ENUM DEFINITIONS ---

# class AssetTypeEnum(str, enum.Enum):
#     Laptop = "Laptop"
#     Charger = "Charger"
#     Network = "Network"


# class LocationEnum(str, enum.Enum):
#     WFH = "WFH"
#     WFO = "WFO"


# class StatusEnum(str, enum.Enum):
#     Open = "Open"
#     Assigned = "Assigned"
#     Closed = "Closed"


# # --- USER MODEL ---
# class User(Base):
#     __tablename__ = "users"

#     id = Column(Integer, primary_key=True, index=True, autoincrement=True)  # ✅ added autoincrement
#     email = Column(String, unique=True, index=True, nullable=False)
#     name = Column(String, nullable=True)

#     # Relationship to assets
#     assets = relationship("Asset", back_populates="user", cascade="all, delete")


# # --- ASSET MODEL ---
# class Asset(Base):
#     __tablename__ = "assets"

#     id = Column(Integer, primary_key=True, index=True, autoincrement=True)  # ✅ added autoincrement
#     user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=True)

#     email = Column(String, nullable=False)
#     type = Column(Enum(AssetTypeEnum, name="asset_type_enum", native_enum=False), nullable=False)
#     location = Column(Enum(LocationEnum, name="location_enum", native_enum=False), nullable=True)
#     status = Column(Enum(StatusEnum, name="status_enum", native_enum=False), default=StatusEnum.Open, nullable=False)

#     open_date = Column(DateTime, default=datetime.utcnow, nullable=False)
#     close_date = Column(DateTime, nullable=True)

#     # Relationship back to User
#     user = relationship("User", back_populates="assets")
from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, Text,TIMESTAMP, func, Date
from sqlalchemy.ext.declarative import declarative_base

from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, nullable=False)  # Make sure this exists
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)

class Asset(Base):
    __tablename__ = "assets"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    # Map to existing DB column names while keeping attribute names used by app
    email = Column('email_id', String(255), nullable=False)
    type = Column('asset_type', String(50), nullable=False)
    location = Column(String(10), nullable=False)
    status = Column(String(20), nullable=False)
    description = Column(Text, nullable=True)
    open_date = Column('assigned_date', DateTime(timezone=False), nullable=True)
    close_date = Column('return_date', DateTime(timezone=False), nullable=True)

# Use the shared Base imported from app.database for all models

class UserProfile(Base):
    __tablename__ = "user_profile"

    user_id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(150), nullable=False)
    email = Column(String(255), unique=True, nullable=False)
    mobile_number = Column(String(20), nullable=True)
    role = Column(String(50), nullable=False)
    department = Column(String(50), nullable=False)
    date_of_birth = Column(Date, nullable=True)
    user_status = Column(String(20), default="Active", nullable=False)
    created_at = Column(TIMESTAMP, server_default=func.now())
    updated_at = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())
