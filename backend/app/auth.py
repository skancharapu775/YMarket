from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app import models
from jose import jwt, JWTError
from datetime import datetime, timedelta
from passlib.context import CryptContext
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests

router = APIRouter()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")
SECRET = "BaM6BJS3wgaijrWCBABGgLow2Z_klM9u1aaubxmPK9I"
ALGORITHM = "HS256"

def get_db():
    db = models.SessionLocal()
    try:
        yield db
    finally:
        db.close()

class UserCreate(BaseModel):
    email: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class GoogleToken(BaseModel):
    token: str


def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET, algorithms=[ALGORITHM])
        email = payload.get("sub")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    db = models.SessionLocal()
    user = db.query(models.User).filter(models.User.email == email).first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return user

@router.post("/register", response_model=Token)
def register(user: UserCreate, db: Session = Depends(get_db)):
    existing = db.query(models.User).filter(models.User.email == user.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    hashed = pwd_context.hash(user.password)
    new_user = models.User(email=user.email, hashed_password=hashed)
    try:
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
    except Exception as e:
        print("❌ DB error:", e)
        raise HTTPException(status_code=500, detail="Server error")
    return create_token(new_user.email)

@router.post("/login", response_model=Token)
def login(user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user.auth_provider == "local":
        if not db_user or not pwd_context.verify(user.password, db_user.hashed_password):
            raise HTTPException(status_code=401, detail="Invalid credentials")
    else:
        raise HTTPException(status_code=400, detail="Use Google login for this account.")
    return create_token(db_user.email)

@router.post("/google")
def login_with_google(data: GoogleToken, db: Session = Depends(get_db)):
    token = data.token
    try:
        idinfo = id_token.verify_oauth2_token(token, google_requests.Request(), "89565253405-se6bp162e4s5do2ei6nk2ip064kmjp77.apps.googleusercontent.com")
        email = idinfo['email']
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid token")

    user = db.query(models.User).filter(models.User.email == email).first()
    if not user:
        new_user = models.User(email=email, hashed_password="", auth_provider="Google")
        try:
            db.add(new_user)
            db.commit()
            db.refresh(new_user)
        except Exception as e:
            print("❌ DB error:", e)
            raise HTTPException(status_code=500, detail="Server error")
    # Return user's JWT
    return create_token(email)

def create_token(email: str):
    payload = {
        "sub": email,
        "exp": datetime.utcnow() + timedelta(hours=1)
    }
    token = jwt.encode(payload, SECRET, algorithm=ALGORITHM)
    return {"access_token": token}