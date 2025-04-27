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
def list_movies(skip: int = 0, limit: int = 20):
    movies = movies_df.iloc[skip:skip+limit].copy()
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
def recommend(user_id: int = Query(..., description="User ID"), top_n: int = 5, top_k_similar_users: int = 10):
    # Build user-item matrix
    user_item = ratings_df.pivot_table(index='userId', columns='movieId', values='rating').fillna(0)
    if user_id not in user_item.index:
        return {"user_id": user_id, "recommendations": [], "reason": "User has no ratings"}
    # Compute similarity between users
    user_sim = cosine_similarity([user_item.loc[user_id]], user_item)[0]
    # Get indices of top K similar users (excluding self)
    similar_users_idx = np.argsort(-user_sim)
    similar_users = user_item.index[similar_users_idx]
    similar_users = [uid for uid in similar_users if uid != user_id][:top_k_similar_users]
    # Aggregate ratings from similar users
    similar_ratings = user_item.loc[similar_users]
    # Exclude movies already rated by the target user
    user_rated = set(user_item.loc[user_id][user_item.loc[user_id] > 0].index)
    mean_ratings = similar_ratings.mean(axis=0)
    mean_ratings = mean_ratings.drop(labels=user_rated, errors='ignore')
    # Recommend top N movies
    top_movies = mean_ratings.sort_values(ascending=False).head(top_n).index
    # Merge with links_df to get tmdbId
    rec_movies = movies_df[movies_df['movieId'].isin(top_movies)].copy()
    rec_movies = rec_movies.merge(links_df[['movieId', 'tmdbId']], on='movieId', how='left')
    def parse_tmdbid(x):
        try:
            return int(x)
        except:
            return None
    rec_movies['tmdbId'] = rec_movies['tmdbId'].apply(parse_tmdbid)
    recommendations = rec_movies.to_dict(orient="records")
    return {"user_id": user_id, "recommendations": recommendations}
