# Recommendation Demo (MovieLens)

A demo project showcasing a movie recommendation system using Python (FastAPI) for the backend and Next.js for the frontend.

## Structure
- `backend/`: Python FastAPI service serving recommendations
- `frontend/`: Next.js React app for user interaction

## Getting Started

### 1. Download MovieLens 100k Dataset
- Download from [MovieLens 100k](https://grouplens.org/datasets/movielens/100k/)
- Extract `u.data` and `u.item` into `backend/data/`

### 2. Backend Setup
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

---

## Next Steps
- Implement real recommendation logic in `backend/main.py`
- Build the Next.js frontend in `frontend/`
- Connect frontend to `/recommend` API
- Polish UI/UX and add explanations for recommendations

---

## Product Notes
- See README for product vision, business value, and technical notes.
