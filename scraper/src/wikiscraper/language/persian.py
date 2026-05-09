from typing import List
from abc import ABC, abstractmethod
from pandas import DataFrame
import re
from re import Pattern
from wikiscraper.language.base import LanguageDataStrategy
from hazm import Normalizer


class PersianLanguageStrategy(LanguageDataStrategy):
    @property
    def song_keyword(self) -> str:
        return "ترانه"

    @property
    def column_mapping(self) -> dict:
        return {
            "song_name": [self.song_keyword],
            "composer": ["آهنگساز", "آهنگ‌ساز", "آهنگساز"],
            "song_writer": ["ترانهسرا"],
            "tuning": ["تنظیم"],
        }

    @property
    def people_columns(self) -> list:
        return ["composer", "song_writer", "tuning"]

    @property
    def song_split_pattern(self) -> Pattern:
        return re.compile(r"\s*/\s*|\s*،\s*|\s*,\s*|\s+و\s+", re.IGNORECASE)

    def language_specific_cleaning(self, df: DataFrame) -> DataFrame:
        df = self.normalize_persian_text(df)
        return df

    def normalize_persian_text(self, df: DataFrame) -> DataFrame:
        normalizer = Normalizer()

        def normalize_value(val):
            if not isinstance(val, str) or not val.strip():
                return val
            return normalizer.normalize(val)

        return df.map(normalize_value)
