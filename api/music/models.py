from django.db import models


class Song(models.Model):
    album_id = models.CharField(max_length=255, default="")
    song_name = models.CharField(max_length=255, default="")
    composer_name = models.CharField(max_length=255, blank=True, default="")
    lyricist_name = models.CharField(max_length=255, blank=True, default="")
    tuning_name = models.CharField(max_length=255, blank=True, default="")
    description = models.TextField(blank=True, default="")
    artist_name = models.CharField(max_length=255)
    country = models.CharField(max_length=255, blank=True, default="")

    def __str__(self) -> str:
        return str(self.song_name)


class Artist(models.Model):
    artist_name = models.CharField(max_length=100, default="Unknown")
    link = models.URLField()
    aliases = models.CharField(max_length=100, blank=True, default="Unknown")
    country = models.CharField(max_length=100, default="Unknown")

    def __str__(self):
        return self.artist_name
