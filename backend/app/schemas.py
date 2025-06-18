# app/schemas.py
from typing import Optional
from pydantic import BaseModel

class ListingCreate(BaseModel):
    title: str
    description: str
    asking_price: float

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