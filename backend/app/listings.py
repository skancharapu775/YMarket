from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from app import models, auth, schemas
from typing import List
from openai import OpenAI
import os
import shutil
from pathlib import Path
import re


router = APIRouter()

# Create uploads directory if it doesn't exist
UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)


@router.get("/get", response_model=List[schemas.ListingOut])
def get_listings(db: Session = Depends(auth.get_db)):
    return db.query(models.Listing).filter(models.Listing.sold == False).all()

@router.get("/my-unsold", response_model=List[schemas.ListingOut], )
def get_my_unsold_listings(db: Session = Depends(auth.get_db), current_user: models.User = Depends(auth.get_current_user)):
    return db.query(models.Listing).filter(
        models.Listing.owner_id == current_user.id,
        models.Listing.sold == False).all()

@router.get("/{listing_id}", response_model=schemas.ListingOut)
def get_listing(listing_id: int, db: Session = Depends(auth.get_db)):
    listing = db.query(models.Listing).filter(models.Listing.id == listing_id).first()
    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found")
    return listing

@router.post("/submit")
async def create_listing(
    title: str = Form(...),
    description: str = Form(...),
    asking_price: float = Form(...),
    images: List[UploadFile] = File(...),
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(auth.get_db)
):
    try:
        ai_input = schemas.PriceGenerationRequest(title=title, description=description)
        result = generate_price(ai_input)
        price = result["suggested_price"]
        reasoning = result["reasoning"]
        print(reasoning)
        spread = 5/100 * price
        ai_low = max(price - spread, 0)
        ai_high = price + spread
    except Exception as e:
        print(f"AI pricing failed: {e}")
        ai_low = None
        ai_high = None

    # Create the listing
    listing = models.Listing(
        title=title,
        description=description,
        asking_price=asking_price,
        owner_id=current_user.id,
        ai_low=ai_low,
        ai_high=ai_high,
        ai_reasoning=reasoning
    )
    db.add(listing)
    db.flush()  # Get the listing ID
    
    # Save uploaded images
    for image_file in images:
        if image_file.content_type.startswith('image/'):
            # Create unique filename
            file_extension = Path(image_file.filename).suffix
            unique_filename = f"{listing.id}_{len(listing.images)}_{os.urandom(8).hex()}{file_extension}"
            file_path = UPLOAD_DIR / unique_filename
            
            # Save file to disk
            with open(file_path, "wb") as buffer:
                shutil.copyfileobj(image_file.file, buffer)
            
            # Save image record to database
            db_image = models.ListingImage(
                filename=unique_filename,
                file_path=str(file_path),
                listing_id=listing.id
            )
            db.add(db_image)
    
    db.commit()
    db.refresh(listing)
    return listing

# the next functions are for purchase functionality

@router.post("/contact-log/")
def create_contact_log(payload: schemas.ContactLogRequest, current_user: models.User = Depends(auth.get_current_user), db: Session = Depends(auth.get_db)):
    existing = db.query(models.ContactLog).filter_by(user_id=current_user.id, listing_id=payload.listing_id).first()
    listing = db.query(models.Listing).filter_by(id=payload.listing_id).first()
    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found")
    seller = db.query(models.User).filter_by(id=listing.owner_id).first()
    if not seller:
        raise HTTPException(status_code=404, detail="Seller not found")
    if existing:
        return {"message": "Already contacted", "contact_email": seller.email, "contact_phone": seller.phone}

    log = models.ContactLog(user_id=current_user.id, listing_id=payload.listing_id)
    db.add(log)
    db.commit()
    return {"message": "Contact log saved", "contact_email": seller.email, "contact_phone": seller.phone}

@router.get("/contact-log/{listing_id}")
def get_interested_users(listing_id: int, db: Session = Depends(auth.get_db)):
    logs = db.query(models.ContactLog).filter_by(listing_id=listing_id).all()
    return [{"user_id": log.user_id, "email": log.user.email} for log in logs]

@router.post("/transactions/complete")
def complete_transaction(
    payload: schemas.CompleteTransactionRequest,
    db: Session = Depends(auth.get_db),
    current_user: models.User = Depends(auth.get_current_user),
):
    listing = db.query(models.Listing).filter_by(id=payload.listing_id).first()
    if not listing or listing.sold:
        raise HTTPException(400, "Listing not found or already sold")

    # Figure out buyer
    buyer_id = payload.buyer_id
    if not buyer_id and payload.buyer_email:
        buyer = db.query(models.User).filter_by(email=payload.buyer_email).first()
        if not buyer:
            raise HTTPException(404, "Buyer not found by email")
        buyer_id = buyer.id

    if not buyer_id:
        raise HTTPException(400, "No buyer specified")

    transaction = models.Transaction(
        listing_id=payload.listing_id,
        buyer_id=buyer_id,
        seller_id=current_user.id,
        amount_received=payload.amount_received,
        status="finished"
    )
    listing.sold = True

    db.add(transaction)
    db.commit()

    return {"message": "Transaction completed"}

# AI Features below. 

@router.post("/generate_price")
def generate_price(data: schemas.PriceGenerationRequest):
    try:
        # Get API key from environment variable
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key:
            print("OPENAI_API_KEY environment variable not set")
            return _fallback_price_generation(data)
        
        # Initialize OpenAI client with the new API
        client = OpenAI(api_key=api_key)
        
        # Create a prompt for price generation
        prompt = f"""
        Based on the following item listing, suggest a reasonable asking price in USD and explain your reasoning in 2 very concise sentences.
        
        Title: {data.title}
        Description: {data.description}
        
        Please consider:
        - The type of item
        - Condition implied by the description
        - Market value for similar items
        - Any unique features mentioned
        
        Format your response like this:
        Price: [number only, no $ symbol]
        Reason: [short paragraph, two to four sentences]
        """
        
        # Make OpenAI API call using the new syntax
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a pricing expert. Provide only numerical price suggestions in USD."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=80,
            temperature=0.3
        )
        
        # Extract the suggested price from the response
        content = response.choices[0].message.content.strip()
        
        price_match = re.search(r"Price:\s*([\d.]+)", content)
        reason_match = re.search(r"Reason:\s*(.+)", content, re.DOTALL)

        if not price_match or not reason_match:
            raise ValueError("OpenAI response did not match expected format.")

        suggested_price = round(float(price_match.group(1)))
        reasoning = reason_match.group(1).strip()
        
        return {"suggested_price": suggested_price, "reasoning": reasoning}
        
    except Exception as e:
        print(f"OpenAI API error: {e}")
        return _fallback_price_generation(data)

def _fallback_price_generation(data: schemas.PriceGenerationRequest):
    """Fallback price generation algorithm when OpenAI is unavailable"""
    base_price = 50.0
    title_bonus = len(data.title) * 2
    description_bonus = len(data.description) * 0.5
    
    suggested_price = base_price + title_bonus + description_bonus
    suggested_price = round(suggested_price)
    
    return {"suggested_price": suggested_price, "reasoning": "Currently unable to provide reasoning."}

@router.delete("/{listing_id}")
def delete_listing(listing_id: int, current_user: models.User = Depends(auth.get_current_user), db: Session = Depends(auth.get_db)):
    listing = db.query(models.Listing).filter(models.Listing.id == listing_id).first()
    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found")
    
    if listing.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this listing")
    
    db.delete(listing)
    db.commit()
    return {"message": "Listing deleted successfully"}

@router.put("/{listing_id}")
def update_listing(listing_id: int, data: schemas.ListingUpdate, current_user: models.User = Depends(auth.get_current_user), db: Session = Depends(auth.get_db)):
    listing = db.query(models.Listing).filter(models.Listing.id == listing_id).first()
    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found")
    
    if listing.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to edit this listing")
    
    # Update the listing fields
    if data.title is not None:
        listing.title = data.title
    if data.description is not None:
        listing.description = data.description
    if data.asking_price is not None:
        listing.asking_price = data.asking_price
    
    # Regenerate AI pricing if title or description changed
    if data.title is not None or data.description is not None:
        try:
            ai_input = schemas.PriceGenerationRequest(
                title=data.title or listing.title, 
                description=data.description or listing.description
            )
            result = generate_price(ai_input)
            price = result["suggested_price"]
            spread = 5/100 * price
            listing.ai_low = max(price - spread, 0)
            listing.ai_high = price + spread
        except Exception as e:
            print(f"AI pricing failed: {e}")
            # Keep existing AI pricing if regeneration fails
    
    db.commit()
    db.refresh(listing)
    return listing

@router.get("/stats/user")
def get_user_stats(current_user: models.User = Depends(auth.get_current_user), db: Session = Depends(auth.get_db)):
    # Get all listings for the current user
    user_listings = db.query(models.Listing).filter(models.Listing.owner_id == current_user.id).all()
    
    # Calculate stats
    total_listings = len(user_listings)
    sold_listings = [listing for listing in user_listings if listing.sold]
    items_sold = len(sold_listings)
    
    # Calculate total revenue from sold items
    total_revenue = sum(listing.asking_price for listing in sold_listings)
    
    # Calculate AI savings (difference between AI suggested price and actual price)
    ai_savings = 0
    for listing in sold_listings:
        if listing.ai_low and listing.ai_high:
            ai_suggested_price = (listing.ai_low + listing.ai_high) / 2
            if listing.asking_price < ai_suggested_price:
                ai_savings += ai_suggested_price - listing.asking_price
    
    return {
        "items_listed": total_listings,
        "items_sold": items_sold,
        "total_revenue": round(total_revenue, 2),
        "ai_savings": round(ai_savings, 2)
    }