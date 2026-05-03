import sys
from wikiscraper.language.language_factory import get_language_strategy
from wikiscraper.parsing import Parser
from wikiscraper.normalise import Normaliser
from wikiscraper.models.artist import Artist

REQUIRED_ARGS_COUNT = 2


def main():
    try:
        if len(sys.argv) != REQUIRED_ARGS_COUNT:
            print_usage()
            sys.exit(1)

        country_selected = sys.argv[1]
        language_strategy = get_language_strategy(country_selected)

        artist = Artist(
            name="Ebi",
            url="https://fa.wikipedia.org/wiki/%D8%AA%D8%B1%D8%A7%D9%86%D9%87%E2%80%8C%D8%B4%D9%86%D8%A7%D8%B3%DB%8C_%D8%A7%D8%A8%DB%8C",
        )

        parser = Parser(language_strategy, artist)
        normaliser = Normaliser(language_strategy, artist)

        metadata_tables = parser.get_metadata_tables()
        print(f"len: {len(metadata_tables)}")

        normalised_tables = normaliser.normalise_tables(metadata_tables)

        print(normalised_tables[0])
    except ValueError as e:
        print(f"error: {e}")
        sys.exit(1)

    except Exception as e:
        print(f"Unexpected error occured: {e}")
        sys.exit(1)


def print_usage():
    print("USAGE: cli.py <IRAN|INDIA|TURKEY|EGYPT")


if __name__ == "__main__":
    main()
