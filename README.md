# YMarket

A marketplace application with FastAPI backend and React frontend.

## Quick Start

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install Python dependencies:
```bash
pip install -r requirements.txt
```

3. Run the FastAPI server:
```bash
uvicorn app.main:app --reload
```

The backend will be available at `http://127.0.0.1:8000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install Node.js dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

## API Endpoints

- `GET /` - Health check
- `GET /listings` - Get all listings
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user

## API Documentation

Once the backend is running, visit:
- Interactive docs: `http://127.0.0.1:8000/docs`
- Alternative docs: `http://127.0.0.1:8000/redoc` 