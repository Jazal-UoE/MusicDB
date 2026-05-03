from django.db.models import Q
from collections import Counter
from .models import Song


def get_top_contributors(artist: str):
    target_artist = artist.lower()

    artist_counter = Counter()
    composer_counter = Counter()
    lyricist_counter = Counter()
    tuning_counter = Counter()

    songs = Song.objects.filter(
        Q(artist_name__icontains=target_artist)
        | Q(composer_name__icontains=target_artist)
        | Q(lyricist_name__icontains=target_artist)
        | Q(tuning_name__icontains=target_artist)
    )

    for song in songs:
        artist_names = {
            n.strip().lower() for n in song.artist_name.split(",") if n.strip()
        }
        composer_names = {
            n.strip().lower() for n in song.composer_name.split(",") if n.strip()
        }
        lyricist_names = {
            n.strip().lower() for n in song.lyricist_name.split(",") if n.strip()
        }
        tuning_names = {
            n.strip().lower() for n in song.tuning_name.split(",") if n.strip()
        }

        all_names = artist_names | tuning_names | lyricist_names | tuning_names

        if target_artist in all_names:
            for name in all_names:
                if name == target_artist or name == "unknown":
                    continue
                if name in artist_names:
                    artist_counter[name] += 1
                if name in composer_names:
                    composer_counter[name] += 1
                if name in lyricist_names:
                    lyricist_counter[name] += 1
                if name in tuning_names:
                    tuning_counter[name] += 1

    return {
        "artist_connections": dict(artist_counter.most_common()),
        "composer_connections": dict(composer_counter.most_common()),
        "lyricist_connections": dict(lyricist_counter.most_common()),
        "tuning_connections": dict(tuning_counter.most_common()),
    }
