from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from music.models import Song, Artist


class MusicAPITestCase(APITestCase):
    def setUp(self):
        # Create test data
        self.artist1 = Artist.objects.create(artist_name="Adele", country="UK")

        self.artist2 = Artist.objects.create(artist_name="Drake", country="Canada")

        self.song1 = Song.objects.create(
            song_name="Hello",
            artist_name="Adele",
            composer_name="Adele, Greg Kurstin",
            lyricist_name="Adele",
            tuning_name="Standard",
            country="UK",
        )

        self.song2 = Song.objects.create(
            song_name="Hotline Bling",
            artist_name="Drake",
            composer_name="Drake",
            lyricist_name="Drake",
            tuning_name="Standard",
            country="Canada",
        )

    # ----------------------------
    # SONG SEARCH
    # ----------------------------
    def test_song_search(self):
        url = "/api/songs/search/?query=he"
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("Hello", response.data)

    def test_song_search_short_query(self):
        url = "/api/songs/search/?query=h"
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, [])

    # ----------------------------
    # ARTIST SEARCH
    # ----------------------------
    def test_artist_search(self):
        url = "/api/artists/search/?query=ad"
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("Adele", response.data)

    # ----------------------------
    # SONG LIST FILTER
    # ----------------------------
    def test_song_filter_by_country(self):
        url = "/api/songs/filter/?country=UK"
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["results"]), 1)

    # ----------------------------
    # ARTIST LIST FILTER
    # ----------------------------
    def test_artist_filter_by_country(self):
        url = "/api/artists/filter/?country=UK"
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["results"]), 1)

    # ----------------------------
    # SONG DETAILS
    # ----------------------------
    def test_song_details(self):
        url = "/api/songs/details/?song_name=Hello"
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["song_name"], "Hello")

    def test_song_details_missing(self):
        url = "/api/songs/details/"
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    # ----------------------------
    # ARTIST CONTRIBUTORS
    # ----------------------------
    def test_artist_contributors(self):
        url = "/api/artist/contributors/?artist_name=adele"
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("artist_connections", response.data)
