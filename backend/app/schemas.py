# app/schemas.py
from typing import Optional, List
from pydantic import BaseModel

class ListingCreate(BaseModel):
    title: str
    description: str
    asking_price: float

class ListingUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    asking_price: Optional[float] = None

class ListingImageOut(BaseModel):
    id: int
    filename: str
    file_path: str

class ListingOut(BaseModel):
    id: int
    title: str
    description: str
    asking_price: float
    ai_low: Optional[float]
    ai_high: Optional[float]
    sold: bool
    images: List[ListingImageOut] = []

class PriceGenerationRequest(BaseModel):
    title: str
    description: str

class ContactLogRequest(BaseModel):
    listing_id: int