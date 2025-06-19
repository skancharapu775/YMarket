# app/schemas.py
from typing import Optional
from pydantic import BaseModel

class ListingCreate(BaseModel):
    title: str
    description: str
    asking_price: float

class ListingUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    asking_price: Optional[float] = None

class ListingOut(BaseModel):
    id: int
    title: str
    description: str
    asking_price: float
    ai_low: Optional[float]
    ai_high: Optional[float]
    sold: bool

class PriceGenerationRequest(BaseModel):
    title: str
    description: str