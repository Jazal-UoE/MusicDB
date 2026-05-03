from wikiscraper.language.base import LanguageDataStrategy
from wikiscraper.language.persian import PersianLanguageStrategy


def get_language_strategy(countryName: str) -> LanguageDataStrategy:
    countryName = countryName.upper()
    match countryName:
        case "IRAN":
            return PersianLanguageStrategy()
        case _:
            raise ValueError(f"Unknown Country: {countryName}")
