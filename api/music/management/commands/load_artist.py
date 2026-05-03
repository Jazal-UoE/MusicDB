from django.core.management.base import BaseCommand
from music.models import Artist
import csv


class Command(BaseCommand):
    help = "Load artist data from a CSV file"

    def add_arguments(self, parser):
        parser.add_argument("csv_path", type=str, help="Path to the CSV file")
        parser.add_argument("--country", type=str, help="Country for the artists")

    def handle(self, *args, **options):
        csv_path = options["csv_path"]
        country = options["country"]
        with open(csv_path, "r", encoding="utf-8") as csvfile:
            reader = csv.DictReader(csvfile)
            for row in reader:
                Artist.objects.create(
                    artist_name=row["artist_name"],
                    link=row.get("link", ""),
                    aliases=row.get("aliases", ""),
                    country=country,
                )

        self.stdout.write(self.style.SUCCESS("Successfully loaded artist data"))
