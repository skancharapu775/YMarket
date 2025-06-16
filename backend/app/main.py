from fastapi import FastAPI
from app import models
from app import auth

models.Base.metadata.create_all(bind=models.engine)

app = FastAPI()
app.include_router(auth.router, prefix="/auth")

@app.get("/")
def root():
    return {"message": "Backend is working!"}
