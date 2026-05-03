from typing import List
from pandas import DataFrame

from wikiscraper.language.base import LanguageDataStrategy
from wikiscraper.models.artist import Artist
from wikiscraper.utils import normalise_string


class Normaliser:
    def __init__(self, strategy: LanguageDataStrategy, artist: Artist) -> None:
        self.strategy = strategy
        self.artist = artist

    def normalise_tables(self, metadata_tables: List[DataFrame]) -> List[DataFrame]:
        normalised_metadata_tables = []
        for table in metadata_tables:
            normalised_with_artist_col = self._normalise_and_insert_artist(table)

            normalised_metadata_tables.append(normalised_with_artist_col)

        return normalised_metadata_tables

    def _normalise_and_insert_artist(self, table: DataFrame) -> DataFrame:
        normalised = self._normalise_table(table)

        artist_name = self.artist.name
        normalised_with_artist_col = self._insert_artist_column(normalised, artist_name)
        return normalised_with_artist_col

    def _normalise_table(self, table: DataFrame) -> DataFrame:
        normalised_df = DataFrame()
        column_mapping = self._match_columns(table)
        for key, value in column_mapping.items():
            if value is not None:
                normalised_df[key] = table.get(value)

            else:
                normalised_df[key] = None

        return normalised_df

    def _match_columns(self, df: DataFrame) -> dict:
        matched_columns = {}

        for key, value in self.strategy.column_mapping.items():
            matched_columns[key] = None

            for col in df.columns:
                if any(normalise_string(val) in col for val in value):
                    matched_columns[key] = col
                    break

        return matched_columns

    def _insert_artist_column(self, table: DataFrame, artist_name: str) -> DataFrame:
        if not artist_name:
            raise ValueError("Artist name cannot be none or empty")
        table = table.copy()
        table.insert(1, "artist", [artist_name] * len(table))
        return table


# create new dataframe using these mappings,

# replace table in metadatatables with new
