#!/usr/bin/env python3
"""
Script to remove listings with specific titles from the database.
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.models import SessionLocal, Listing, ListingImage, Transaction, ContactLog
from sqlalchemy import or_
import shutil
from pathlib import Path

def remove_specific_items():
    """Remove listings with specific titles"""
    db = SessionLocal()
    
    titles_to_remove = [
        "Macbook Pro 2021 M1 Pro",
        "Make America Great Again Cap"
    ]
    try:
        # Find all listings with the exact titles
        listings = db.query(Listing).filter(Listing.title.in_(titles_to_remove)).all()
        
        print(f"Found {len(listings)} listings with the specified titles:")
        
        for listing in listings:
            print(f"  - ID: {listing.id}, Title: '{listing.title}', Price: ${listing.asking_price}")
        
        if not listings:
            print("No listings with the specified titles found.")
            return
        
        # Delete related data first
        for listing in listings:
            listing_id = listing.id
            
            # Delete contact logs
            contact_logs = db.query(ContactLog).filter(ContactLog.listing_id == listing_id).all()
            for log in contact_logs:
                db.delete(log)
            
            # Delete transactions
            transactions = db.query(Transaction).filter(Transaction.listing_id == listing_id).all()
            for transaction in transactions:
                db.delete(transaction)
            
            # Delete images from disk and database
            images = db.query(ListingImage).filter(ListingImage.listing_id == listing_id).all()
            for image in images:
                # Delete file from disk
                image_path = Path(image.file_path)
                if image_path.exists():
                    try:
                        image_path.unlink()
                        print(f"  Deleted image file: {image.filename}")
                    except Exception as e:
                        print(f"  Warning: Could not delete image file {image.filename}: {e}")
                
                # Delete from database
                db.delete(image)
            
            # Delete the listing itself
            db.delete(listing)
            print(f"  Deleted listing: {listing.title}")
        
        # Commit all changes
        db.commit()
        print(f"\nSuccessfully deleted {len(listings)} listings with the specified titles.")
        
    except Exception as e:
        print(f"Error: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    remove_specific_items() 