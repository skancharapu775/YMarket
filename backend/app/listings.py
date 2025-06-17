from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app import models, auth, schemas
from typing import List


router = APIRouter()


@router.get("/get", response_model=List[schemas.ListingOut])
def get_listings(db: Session = Depends(auth.get_db)):
    return db.query(models.Listing).all()

@router.post("/submit")
def create_listing(data: schemas.ListingCreate, current_user: models.User = Depends(auth.get_current_user), db: Session = Depends(auth.get_db)):
    listing = models.Listing(
        title=data.title,
        description=data.description,
        asking_price=data.asking_price,
        owner_id=current_user.id,
    )
    db.add(listing)
    db.commit()
    db.refresh(listing)
    return listing