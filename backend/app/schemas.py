# app/schemas.py

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