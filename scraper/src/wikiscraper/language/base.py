from abc import ABC, abstractmethod
from re import Pattern

from pandas import DataFrame


class LanguageDataStrategy(ABC):
    @property
    @abstractmethod
    def song_keyword(self) -> str:
        pass

    @property
    @abstractmethod
    def column_mapping(self) -> dict:
        pass

    @property
    @abstractmethod
    def people_columns(self) -> list:
        pass

    @property
    @abstractmethod
    def song_split_pattern(self) -> Pattern:
        pass

    @abstractmethod
    def language_specific_cleaning(self, df: DataFrame) -> DataFrame:
        pass
