from typing import List
from abc import ABC, abstractmethod
from pandas import DataFrame

from wikiscraper.language.base import LanguageDataStrategy


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
