from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app import models
from app import auth

models.Base.metadata.create_all(bind=models.engine)

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # or ["*"] for local dev
    allow_credentials=True,
    allow_methods=["*"],  # ✅ must allow OPTIONS
    allow_headers=["*"],
)
app.include_router(auth.router, prefix="/auth")

@app.get("/")
def root():
    return {"message": "Backend is working!"}
