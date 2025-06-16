from fastapi import FastAPI
from .auth import router as auth_router
from .listings import router as listings_router

app = FastAPI()

app.include_router(auth_router, prefix="/auth")
app.include_router(listings_router, prefix="/listings")

@app.get("/")
def root():
    return {"message": "Backend is working!"}
