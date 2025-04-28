# FastAPI backend for MovieLens recommendation demo
from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from typing import List
import pandas as pd
import os

app = FastAPI()

# Allow CORS for local frontend development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load MovieLens data
ML_DATA_DIR = os.path.join(os.path.dirname(__file__), "../ml-latest-small")
MOVIES_CSV = os.path.join(ML_DATA_DIR, "movies.csv")
RATINGS_CSV = os.path.join(ML_DATA_DIR, "ratings.csv")

# Load data into pandas DataFrames
movies_df = pd.read_csv(MOVIES_CSV)
ratings_df = pd.read_csv(RATINGS_CSV)

from pydantic import BaseModel
from typing import Optional

class Movie(BaseModel):
    movieId: int
    title: str
    genres: str
    tmdbId: Optional[int] = None

class Rating(BaseModel):
    userId: int
    movieId: int
    rating: float
    timestamp: int = None

# Load links.csv for tmdbId
LINKS_CSV = os.path.join(ML_DATA_DIR, "links.csv")
links_df = pd.read_csv(LINKS_CSV)

@app.get("/movies", response_model=list[Movie])
def list_movies(skip: int = 0, limit: int = 20, search: str = None):
    df = movies_df.copy()
    # If search query, filter by title or genres (case-insensitive)
    if search:
        search_lower = search.lower()
        df = df[df['title'].str.lower().str.contains(search_lower) | df['genres'].str.lower().str.contains(search_lower)]
    movies = df.iloc[skip:skip+limit].copy()
    # Merge with links to get tmdbId
    movies = movies.merge(links_df[['movieId', 'tmdbId']], on='movieId', how='left')
    # Ensure tmdbId is int or None
    def parse_tmdbid(x):
        try:
            return int(x)
        except:
            return None
    movies['tmdbId'] = movies['tmdbId'].apply(parse_tmdbid)
    return movies.to_dict(orient="records")

@app.post("/ratings")
def add_rating(rating: Rating):
    global ratings_df
    # Append the new rating to the DataFrame (in-memory, not persistent)
    new_row = {"userId": rating.userId, "movieId": rating.movieId, "rating": rating.rating, "timestamp": rating.timestamp or 0}
    ratings_df = pd.concat([ratings_df, pd.DataFrame([new_row])], ignore_index=True)
    return {"message": "Rating added"}

from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

@app.get("/recommend")
def recommend(
    selected: Optional[str] = Query(None, description="Comma-separated movie IDs selected by user"),
    top_n: int = 5
):
    if not selected:
        return {"recommendations": [], "reason": "No movies selected"}

    selected_ids = set(int(mid) for mid in selected.split(",") if mid.strip().isdigit())
    # Find users who liked (rated >= 4) any of the selected movies
    liked = ratings_df[(ratings_df['movieId'].isin(selected_ids)) & (ratings_df['rating'] >= 4)]
    similar_users = set(liked['userId'])
    # Gather all movies liked by those users (rated >= 4), except the selected ones
    rec_likes = ratings_df[(ratings_df['userId'].isin(similar_users)) & (ratings_df['rating'] >= 4)]
    rec_likes = rec_likes[~rec_likes['movieId'].isin(selected_ids)]
    # Count and sort recommendations by popularity among similar users
    top_recs = (
        rec_likes['movieId']
        .value_counts()
        .head(top_n)
        .index
    )
    rec_movies = movies_df[movies_df['movieId'].isin(top_recs)].copy()
    rec_movies = rec_movies.merge(links_df[['movieId', 'tmdbId']], on='movieId', how='left')
    def parse_tmdbid(x):
        try:
            return int(x)
        except:
            return None
    rec_movies['tmdbId'] = rec_movies['tmdbId'].apply(parse_tmdbid)
    recommendations = rec_movies.to_dict(orient="records")
    return {"recommendations": recommendations}

    return {"recommendations": recommendations}

