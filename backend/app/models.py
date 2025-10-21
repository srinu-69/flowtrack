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
from sqlalchemy import Column, Integer, String, DateTime, Text
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    full_name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)

class Asset(Base):
    __tablename__ = "assets"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    email_id = Column(String(255), nullable=False)
    asset_type = Column(String(50), nullable=False)
    location = Column(String(50), nullable=False)
    description = Column(Text, nullable=True)
    status = Column(String(20), nullable=False)
    assigned_date = Column(DateTime(timezone=False), nullable=True)
    return_date = Column(DateTime(timezone=False), nullable=True)