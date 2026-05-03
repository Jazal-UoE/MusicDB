from django.core.management.base import BaseCommand
from music.models import Song
import csv


class Command(BaseCommand):
    help = "Load song data from a CSV file"

    def add_arguments(self, parser):
        parser.add_argument("csv_path", type=str, help="The CSV file path")
        parser.add_argument("--country", type=str, help="Country for the songs")

    def handle(self, *args, **options):
        csv_path = options["csv_path"]
        country = options["country"]
        with open(csv_path, "r", encoding="utf-8") as csvfile:
            reader = csv.DictReader(csvfile)
            for row in reader:
                Song.objects.create(
                    album_id=row["album_id"],
                    song_name=row["song_name"],
                    composer_name=row["composer_name"],
                    lyricist_name=row["lyricist_name"],
                    tuning_name=row["tuning_name"],
                    description=row["description"],
                    artist_name=row["artist_name"],
                    country=country,
                )
        self.stdout.write(self.style.SUCCESS("Successfully loaded songs data"))
