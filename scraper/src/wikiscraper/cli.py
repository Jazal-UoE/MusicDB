import sys
from wikiscraper.language.language_factory import get_language_strategy
from wikiscraper.parsing import Parser
from wikiscraper.normalise import Normaliser
from wikiscraper.models.artist import Artist
from wikiscraper.cleaner import Cleaner

import json
from pathlib import Path

REQUIRED_ARGS_COUNT = 2


def main():
    try:
        if len(sys.argv) != REQUIRED_ARGS_COUNT:
            print_usage()
            sys.exit(1)

        country_selected = sys.argv[1]
        language_strategy = get_language_strategy(country_selected)

        artists = load_artists()
        processed_tables = []
        for artist in artists:
            parser = Parser(language_strategy, artist)
            normaliser = Normaliser(language_strategy, artist)

            raw_tables = parser.get_metadata_tables()
            normalised_tables = normaliser.normalise_tables(raw_tables)

            processed_tables.extend(normalised_tables)

        cleaner = Cleaner(strategy=language_strategy)
        cleaner.clean_tables(processed_tables)
    except ValueError as e:
        print(f"error: {e}")
        sys.exit(1)
    except FileNotFoundError as e:
        print(f"Error: '{e.filename}' not found.")
        sys.exit(1)

    except Exception as e:
        print(f"Unexpected error occured: {e}")
        sys.exit(1)


def print_usage():
    print("USAGE: cli.py <IRAN|INDIA|TURKEY|EGYPT")


def load_artists(file_path="data/artists.json"):
    path = Path(file_path)
    with open(path, "r", encoding="utf-8") as f:
        raw_data = json.load(f)
    return [Artist(**entry) for entry in raw_data]


if __name__ == "__main__":
    main()
