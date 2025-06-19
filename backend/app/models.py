# app/models.py
from sqlalchemy import Column, Integer, String, DateTime, Boolean, create_engine, Float, ForeignKey, Text
from sqlalchemy.orm import declarative_base, sessionmaker, relationship
from datetime import datetime, timezone

DATABASE_URL = "sqlite:///./test.db"  # change to postgres later

Base = declarative_base()
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    phone = Column(String, default="")
    hashed_password = Column(String)
    auth_provider = Column(String, default="local")  # or "google"
    # relationships: 
    purchases = relationship("Transaction", back_populates="buyer", foreign_keys="Transaction.buyer_id")
    sales = relationship("Transaction", back_populates="seller", foreign_keys="Transaction.seller_id")

class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True)
    listing_id = Column(Integer, ForeignKey("listings.id"), unique=True)
    buyer_id = Column(Integer, ForeignKey("users.id"))
    seller_id = Column(Integer, ForeignKey("users.id"))
    amount_received = Column(Float)
    status = Column(String, default="finished")

    # Relationship
    buyer = relationship("User", foreign_keys=[buyer_id])
    seller = relationship("User", foreign_keys=[seller_id])
    listing = relationship("Listing", back_populates="transaction")

    timestamp = Column(DateTime, default=datetime.now(timezone.utc))

class ContactLog(Base):
    __tablename__ = "contact_logs"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    listing_id = Column(Integer, ForeignKey("listings.id"))
    timestamp = Column(DateTime, default=datetime.now(timezone.utc))

    user = relationship("User")
    listing = relationship("Listing")


class Listing(Base):
    __tablename__ = "listings"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(Text)
    category = Column(String)
    condition = Column(String)
    asking_price = Column(Float)
    ai_low = Column(Float)
    ai_high = Column(Float)
    sold = Column(Boolean, default=False)

    owner_id = Column(Integer, ForeignKey("users.id"))
    owner = relationship("User", backref="listings")
    images = relationship("ListingImage", back_populates="listing", cascade="all, delete-orphan")
    transaction = relationship("Transaction", back_populates="listing", uselist=False)



class ListingImage(Base):
    __tablename__ = "listing_images"

    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String, nullable=False)
    file_path = Column(String, nullable=False)
    listing_id = Column(Integer, ForeignKey("listings.id"))
    listing = relationship("Listing", back_populates="images")
