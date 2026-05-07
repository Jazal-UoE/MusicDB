from typing import List
from pandas import DataFrame
from bs4 import BeautifulSoup

from wikiscraper.models.artist import Artist
from wikiscraper.tables import table_to_dataframe
from wikiscraper.language.base import LanguageDataStrategy
from wikiscraper.fetch import fetch_and_parse_html
from wikiscraper.utils import normalise_string


class Parser:
    def __init__(self, strategy: LanguageDataStrategy, artist: Artist) -> None:
        self.strategy = strategy
        self.artist = artist

    def get_metadata_tables(
        self,
        url: str,
    ) -> List[DataFrame]:
        if not url:
            raise ValueError("no URL provided and artist URL is missing")

        try:
            soup: BeautifulSoup = fetch_and_parse_html(url)

        except Exception as e:
            raise RuntimeError(f"Failed to fetch or parse HTML from {url}") from e

        metadata_tables = self._find_all_metadata_tables(soup)
        return metadata_tables

    def _find_all_metadata_tables(self, soup: BeautifulSoup) -> List[DataFrame]:
        if not soup:
            return []

        metadata_tables = []
        song_keyword = self.strategy.song_keyword

        for element in soup.find_all("table"):
            df = table_to_dataframe(element)

            if self._is_song_table(df, song_keyword):
                metadata_tables.append(df)

        return metadata_tables

    def _is_song_table(self, df: DataFrame, song_keyword: str) -> bool:
        for col in df.columns:
            if song_keyword in normalise_string(str(col)):
                return True
        return False
