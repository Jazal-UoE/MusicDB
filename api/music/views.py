import os

from django.http import JsonResponse
from rest_framework import viewsets
from rest_framework.pagination import PageNumberPagination
from rest_framework.views import APIView
from rest_framework.response import Response

from django.db.models import Q

from backend import settings
from .models import Artist, Song
from .serializers import ArtistSerializer, SongSerializer

from .top_contributors import get_top_contributors


class ArtistViewSet(viewsets.ModelViewSet):
    queryset = Artist.objects.all()
    serializer_class = ArtistSerializer


class SongViewSet(viewsets.ModelViewSet):
    queryset = Song.objects.all()
    serializer_class = SongSerializer


class StandardPagination(PageNumberPagination):
    page_size = 24
    page_size_query_param = "page_size"
    max_page_size = 1000


class SongListView(APIView):
    def get(self, request, *args, **kwargs):
        paginator = StandardPagination()
        country = request.query_params.get("country")

        if country:
            songs = Song.objects.filter(country__iexact=country)
        else:
            songs = Song.objects.all()

        page = paginator.paginate_queryset(songs, request)
        serializer = SongSerializer(page, many=True)
        return paginator.get_paginated_response(serializer.data)


class ArtistListView(APIView):
    def get(self, request, *args, **kwargs):
        country = request.query_params.get("country")
        paginator = StandardPagination()

        if country:
            artists = Artist.objects.filter(country__iexact=country)
        else:
            artists = Artist.objects.all()

        page = paginator.paginate_queryset(artists, request)
        serializer = ArtistSerializer(page, many=True)

        return paginator.get_paginated_response(serializer.data)


class SongSearchView(APIView):
    def get(self, request, *args, **kwargs):
        query = request.query_params.get("query", "")

        if len(query) < 2:
            return Response([])

        matching_songs = Song.objects.filter(song_name__icontains=query)
        limited_songs = matching_songs[:10]
        song_names = limited_songs.values_list("song_name", flat=True)

        return Response(list(song_names))


class ArtistSearchView(APIView):
    def get(self, request, *args, **kwargs):
        query = request.query_params.get("q", "")

        if len(query) < 2:
            return Response([])

        matching_artists = Artist.objects.filter(artist_name__icontains=query)
        limited_artists = matching_artists[:10]
        artist_names = limited_artists.values_list("artist_name", flat=True)

        return Response(list(artist_names))


class CountryStatisticsView(APIView):
    def get(self, request, *args, **kwargs):
        country = request.query_params.get("country", "")

        if not country:
            return Response({"error": "Country paramter is required"}, status=400)

        artist_count = Artist.objects.filter(country__iexact=country).count()
        song_count = Song.objects.filter(country__iexact=country).count()

        data = {"total_artists": artist_count, "total_songs": song_count}
        return Response(data)


class SongDetailsView(APIView):
    def get(self, request, *args, **kwargs):
        song_name = request.query_params.get("song_name")

        if not song_name:
            return Response({"error": "No song name provided"}, status=400)
        song = Song.objects.filter(song_name__iexact=song_name).first()

        if song:
            return Response(
                {
                    "song_name": song.song_name,
                    "composer_name": song.composer_name,
                    "lyricist_name": song.lyricist_name,
                    "tuning_name": song.tuning_name,
                    "artist_name": song.artist_name,
                }
            )

        else:
            return Response({"error": "Song not found"}, status=404)


class ArtistSongDetailsView(APIView):
    def get(self, request, *args, **kwargs):
        artist_name = request.query_params.get("artist_name")
        if not artist_name:
            return Response({"error": "No artist name provided"}, status=400)

        artist_songs = Song.objects.filter(artist_name__iexact=artist_name)
        composer_songs = Song.objects.filter(
            q_for_name_in_list("composer_name", artist_name)
        )
        lyricist_songs = Song.objects.filter(
            q_for_name_in_list("lyricist_name", artist_name)
        )
        tuner_songs = Song.objects.filter(
            q_for_name_in_list("tuning_name", artist_name)
        )

        artist_songs_serializer = SongSerializer(artist_songs, many=True)
        composer_songs_serializer = SongSerializer(composer_songs, many=True)
        lyricist_songs_serializer = SongSerializer(lyricist_songs, many=True)
        tuner_songs_serializer = SongSerializer(tuner_songs, many=True)

        return Response(
            {
                "artist_songs": artist_songs_serializer.data,
                "composer_songs": composer_songs_serializer.data,
                "lyricist_songs": lyricist_songs_serializer.data,
                "tuner_songs": tuner_songs_serializer.data,
            }
        )


def q_for_name_in_list(field_name, name):
    return (
        Q(**{f"{field_name}__icontains": f",{name},"})
        | Q(**{f"{field_name}__iexact": name})
        | Q(**{f"{field_name}__istartswith": f"{name},"})
        | Q(**{f"{field_name}__iendswith": f",{name}"})
    )


class ArtistContributorsORMView(APIView):
    def get(self, request, *args, **kwargs):
        artist_name = request.query_params.get("artist_name")

        if not artist_name:
            return Response({"error": "No artist name provided"}, status=400)

        results = get_top_contributors(artist_name)

        return Response(results)
