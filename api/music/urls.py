from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ArtistListView,
    ArtistSearchView,
    ArtistSongDetailsView,
    ArtistViewSet,
    SongDetailsView,
    SongListView,
    SongSearchView,
    SongViewSet,
    CountryStatisticsView,
    ArtistContributorsORMView,
)

router = DefaultRouter()
router.register(r"artists", ArtistViewSet)
router.register(r"songs", SongViewSet)


urlpatterns = [
    path("songs/filter/", SongListView.as_view(), name="song-list"),
    path("artists/filter/", ArtistListView.as_view(), name="artist-list"),
    path("songs/search/", SongSearchView.as_view(), name="song-search"),
    path("artists/search/", ArtistSearchView.as_view(), name="artist-search"),
    path("stats/country/", CountryStatisticsView.as_view(), name="country-statistics"),
    path("songs/details/", SongDetailsView.as_view(), name="song-details"),
    path("artists/details/", ArtistSongDetailsView.as_view(), name="song-details"),
    path(
        "artist/contributors/",
        ArtistContributorsORMView.as_view(),
        name="artist-contributors",
    ),
    path("", include(router.urls)),
]
