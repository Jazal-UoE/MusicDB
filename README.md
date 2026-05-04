![MusicDB Banner](./images/🎧MusicDB_banner.png)

### Enhancing Content-Based Music Recommendation Systems for Middle Eastern Music
![GitHub last commit](https://img.shields.io/github/last-commit/Jazal-UoE/MusicDB)

------------------------------------------------------------------------

## Overview

MusicDB is a full-stack music data platform designed to solve a critical
problem in modern music recommendation systems:

**Lack of rich metadata - especially for underrepresented regions like
the Middle East.**

Most platforms rely heavily on collaborative filtering, which: 
- Depends on user interaction data
- Struggles with new or niche music
- Biases toward already popular artists

------------------------------------------------------------------------

## The Idea

MusicDB uses Wikipedia as a large-scale source of music metadata.

This project: 
1. Scrapes music metadata (composer, lyricist, etc.) from artist discography pages by matching html tables to user defined schemas and extracting their metadata.
2. Cleans and standardises the inconsistent data using entity matching and cleaning heuristics.
3. Builds a complete SQL dataset which can then be used by the Django Backend to serve general data queries, contributor statistics per artist and content-based recommendations.
4. Uses a React Frontend to visualise the data, including dynamically generating interactive contributor graphs for each artist page. 

------------------------------------------------------------------------

## Key Features

-   Metadata enrichment beyond traditional datasets
-   Advanced data cleaning (fuzzy matching, NLP)
-   Content-based recommendation engine
-   Full-stack web platform (Django + React)

------------------------------------------------------------------------

## Project Structure

    MusicDB/
    ├── api/                # Django backend
    ├── frontend/           # React frontend
    ├── scraper/
    │   └── src/wikiscraper # Wikipedia scraper package

------------------------------------------------------------------------

## ⚙️ Setup

### Scraper

    cd scraper/src/wikiscraper
    pip install -e .
    python cli.py

### Backend(Django API)
    cd api
    
    # create virtual environment (optional but recommended)
    python -m venv venv
    source venv/bin/activate   # Mac/Linux
    # venv\Scripts\activate    # Windows
    
    # install dependencies
    pip install -r requirements.txt
    
    # apply migrations
    python manage.py migrate
    
    # run server
    python manage.py runserver
The API will be available at http://localhost:8000

### Frontend(React)
    cd frontend
    
    # install dependencies
    npm install
    
    # start development server
    npm start
The frontend will be available at http://localhost:3000

------------------------------------------------------------------------

## Stack

-   Backend: Django, DRF
-   Frontend: React
-   Data: Pandas, NLP, Cosine Similarity

------------------------------------------------------------------------

## 📄 Thesis

Enhancing Content-Based Music Recommendation Systems for Middle Eastern
Music

------------------------------------------------------------------------

## 👤 Author

Jazal Saleem
University of Edinburgh
