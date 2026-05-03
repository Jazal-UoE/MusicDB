from abc import ABC, abstractmethod

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
