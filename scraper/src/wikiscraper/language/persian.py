from typing import List
from abc import ABC, abstractmethod
from pandas import DataFrame
import re
from re import Pattern
from wikiscraper.language.base import LanguageDataStrategy
from hazm import Normalizer, POSTagger, word_tokenize


class PersianLanguageStrategy(LanguageDataStrategy):
    @property
    def key(self) -> str:
        return "ir"

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
        df = self.filter_posttagging(df)
        return df

    def normalize_persian_text(self, df: DataFrame) -> DataFrame:
        normalizer = Normalizer()

        def normalize_value(val):
            if not isinstance(val, str) or not val.strip():
                return val
            return normalizer.normalize(val)

        return df.map(normalize_value)

    def filter_posttagging(self, df: DataFrame) -> DataFrame:
        try:
            tagger = POSTagger(model="models/postagger.model")
        except FileNotFoundError:
            return df

        def is_noun(name) -> bool:
            if not isinstance(name, str) or not name.strip():
                return False
            tokens = word_tokenize(name)

            if len(tokens) > 4:
                return False
            tagged = tagger.tag(tokens)

            non_nouns = 0
            for _, tag in tagged:
                if "N" not in tag:
                    non_nouns += 1

            if len(tokens) > 2 and non_nouns > 1:
                return False
            return True

        def process_value(val):
            if isinstance(val, list):
                res = []
                for name in val:
                    if is_noun(name):
                        res.append(name)
                return res
            elif isinstance(val, str):
                return val if is_noun(val) else None
            return val

        for col in self.people_columns:
            if col in df.columns:
                df[col] = df[col].apply(process_value)
        return df
