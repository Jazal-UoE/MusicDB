![MusicDB Banner](./images/🎧MusicDB_banner.png)

### Enhancing Music Discovery with Rich Metadata & Content-Based Recommendations

------------------------------------------------------------------------

## 🚀 Overview

MusicDB is a full-stack music data platform designed to solve a critical
problem in modern music recommendation systems:

**Lack of rich metadata --- especially for underrepresented regions like
the Middle East.**

Most platforms rely heavily on collaborative filtering, which: - Depends
on user interaction data\
- Struggles with new or niche music\
- Biases toward already popular artists

------------------------------------------------------------------------

## 💡 The Idea

MusicDB uses Wikipedia as a large-scale source of music metadata.

This project: - Scrapes music metadata (composer, lyricist, etc.) -
Cleans and standardises inconsistent data - Builds a structured
dataset - Powers a content-based recommendation system

------------------------------------------------------------------------

## 🧠 Key Features

-   Metadata enrichment beyond traditional datasets\
-   Advanced data cleaning (fuzzy matching, NLP)\
-   Content-based recommendation engine\
-   Full-stack web platform (Django + React)

------------------------------------------------------------------------

## 🏗️ Project Structure

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

------------------------------------------------------------------------

## 🌐 Stack

-   Backend: Django, DRF\
-   Frontend: React\
-   Data: Pandas, NLP, Cosine Similarity

------------------------------------------------------------------------

## 📄 Thesis

Enhancing Content-Based Music Recommendation Systems for Middle Eastern
Music

------------------------------------------------------------------------

## 👤 Author

Jazal Saleem\
University of Edinburgh
