from typing import List
from pandas import DataFrame
from wikiscraper.language.base import LanguageDataStrategy
import pandas as pd

import re

PAREN_PATTERN = re.compile(r"\(.*?\)")
BRACKET_PATTERN = re.compile(r"\[.*?\]")
SPLIT_PATTERN = re.compile(r"\s*/\s*|\s*&\s*|\s*,\s*|\s+and\s+", re.IGNORECASE)


class Cleaner:
    def __init__(self, strategy: LanguageDataStrategy) -> None:
        self.strategy = strategy

    def clean_tables(self, tables: List[DataFrame]) -> List[DataFrame]:
        cleaned_tables = []
        for table in tables:
            cleaned_table = self.clean_table(table)
            cleaned_tables.append(cleaned_table)
        return cleaned_tables

    def clean_table(self, table: DataFrame) -> DataFrame:
        table = self.handle_empty_values(table)
        table = self.normalise_capitalization(table)
        table = self.remove_duplicates(table)
        table = self.remove_empty_song_name(table)
        table = self.clean_song_names(table)
        table = self.split_multiple_songs(table, self.strategy.song_split_pattern)

        columns = self.strategy.people_columns
        table = self.split_people_to_list(table, columns)
        table = self.strip_whitespace(table)
        return table

    def handle_empty_values(self, df):
        df = df.where(pd.notnull(df), None)
        return df

    def normalise_capitalization(self, df: DataFrame) -> pd.DataFrame:
        df = df.copy()

        def format_value(val):
            if not isinstance(val, str):
                return val
            return val.title()

        return df.map(format_value)

    def remove_duplicates(self, df: DataFrame) -> DataFrame:
        return df.drop_duplicates()

    def remove_empty_song_name(self, df: DataFrame) -> DataFrame:
        if "song_name" not in df.columns:
            raise ValueError("DataFrame must contain song_name column")

        return df.loc[df["song_name"].notna()]

    def clean_song_names(self, df: DataFrame) -> DataFrame:
        if "song_name" not in df.columns:
            raise ValueError("DataFrame must contain song_name column")

        df = df.copy()
        df["song_name"] = df["song_name"].apply(self.clean_song_name)
        return df

    def clean_song_name(self, val):
        if not isinstance(val, str):
            return val
        val = self.remove_parenthesis(val)
        val = self.remove_brackets(val)
        val = self.remove_quotes(val)

        return val

    def remove_parenthesis(self, val):
        return PAREN_PATTERN.sub("", val)

    def remove_brackets(self, val):
        return BRACKET_PATTERN.sub("", val)

    def remove_quotes(self, val):
        return val.replace('"', "").replace("'", "")

    def strip_whitespace(self, df: DataFrame) -> DataFrame:
        df = df.copy()

        def clean_value(val):
            if not isinstance(val, str):
                return val

            # strip leading/trailing whitespace
            val = val.strip()
            # replace multiple spaces with single space
            val = " ".join(val.split())
            return val

        return df.map(clean_value)

    def split_multiple_songs(
        self, df: DataFrame, split_pattern: re.Pattern
    ) -> DataFrame:
        if "song_name" not in df.columns:
            raise ValueError("DataFrame must contain song_name column")

        rows = []

        for _, row in df.iterrows():
            song_val = row["song_name"]
            if not isinstance(song_val, str):
                rows.append(row.to_dict())
                continue

            songs = split_pattern.split(song_val)
            split_songs = []
            for s in songs:
                if s.strip():
                    split_songs.append(s.strip())

            if len(split_songs) == 1:
                rows.append(row.to_dict())
                continue
            base_row = row.to_dict()
            for song in split_songs:
                new_row = base_row.copy()
                new_row["song_name"] = song
                rows.append(new_row)

        return pd.DataFrame(rows)

    def split_people_to_list(self, df: DataFrame, columns: List[str]) -> DataFrame:
        df = df.copy()

        def split_val(val):
            if not isinstance(val, str):
                return val

            parts = SPLIT_PATTERN.split(val)
            list_vals = []
            for p in parts:
                if p.strip():
                    list_vals.append(p.strip())
            return list_vals

        for col in columns:
            if col in df.columns:
                df[col] = df[col].apply(split_val)

        return df
