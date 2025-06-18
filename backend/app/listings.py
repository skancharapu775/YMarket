from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app import models, auth, schemas
from typing import List
from openai import OpenAI
import os


router = APIRouter()


@router.get("/get", response_model=List[schemas.ListingOut])
def get_listings(db: Session = Depends(auth.get_db)):
    return db.query(models.Listing).all()

@router.post("/submit")
def create_listing(data: schemas.ListingCreate, current_user: models.User = Depends(auth.get_current_user), db: Session = Depends(auth.get_db)):

    try:
        ai_input = schemas.PriceGenerationRequest(title=data.title, description=data.description)
        result = generate_price(ai_input)
        price = result["suggested_price"]
        spread = 5/100 * price
        ai_low = max(price - spread, 0)
        ai_high = price + spread
    except Exception as e:
        print(f"AI pricing failed: {e}")
        ai_low = None
        ai_high = None

    listing = models.Listing(
        title=data.title,
        description=data.description,
        asking_price=data.asking_price,
        owner_id=current_user.id,
        ai_low=ai_low,
        ai_high=ai_high
    )
    db.add(listing)
    db.commit()
    db.refresh(listing)
    return listing

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
        Based on the following item listing, suggest a reasonable asking price in USD.
        
        Title: {data.title}
        Description: {data.description}
        
        Please consider:
        - The type of item
        - Condition implied by the description
        - Market value for similar items
        - Any unique features mentioned
        
        Respond with only a number representing the suggested price in USD (no currency symbol, no explanation).
        """
        
        # Make OpenAI API call using the new syntax
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a pricing expert. Provide only numerical price suggestions in USD."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=10,
            temperature=0.3
        )
        
        # Extract the suggested price from the response
        suggested_price_text = response.choices[0].message.content.strip()
        
        # Clean up the response and convert to float
        suggested_price = float(''.join(filter(str.isdigit, suggested_price_text)))
        
        # Round to nearest dollar
        suggested_price = round(suggested_price)
        
        return {"suggested_price": suggested_price, "reasoning": suggested_price_text}
        
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