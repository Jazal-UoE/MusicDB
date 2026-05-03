from typing import List
import pandas as pd
from pandas import DataFrame
from bs4 import BeautifulSoup
from typing import Optional

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
        url: Optional[str] = None,
    ) -> List[DataFrame]:
        if url is None:
            url = self.artist.url

        if not url:
            raise ValueError("no URL provided and artist URL is missing")

        try:
            soup: BeautifulSoup = fetch_and_parse_html(url)
        except Exception as e:
            raise RuntimeError(f"Failed to fetch or parse HTML from {url}") from e

        metadata_tables = self._find_all_metadata_tables(soup)
        return metadata_tables

    def _find_all_metadata_tables(self, soup: BeautifulSoup) -> List[DataFrame]:
        metadata_tables = []

        for element in soup.find_all("table"):
            df = table_to_dataframe(element)

            if self._is_metadata_table(df):
                metadata_tables.append(df)

        return metadata_tables

    def _is_metadata_table(self, df: DataFrame) -> bool:
        # if not is_valid_dataframe(df):
        #     return False

        return self._is_song_table(df, self.strategy.song_keyword)

    def _is_song_table(self, table: DataFrame, song_keyword: str) -> bool:
        for col in table.columns:
            if song_keyword in normalise_string(str(col)):
                return True
        return False
