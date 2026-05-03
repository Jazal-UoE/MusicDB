from typing import List, Dict, Set
from pandas import DataFrame
from fuzzywuzzy import process, fuzz
import pandas as pd


class NameUnifier:
    def __init__(self, columns: List[str], threshold: int = 90) -> None:
        self.columns = columns
        self.threshold = threshold
        self.name_mapping: Dict[str, str] = {}

    def unify(self, df: DataFrame) -> DataFrame:
        df = df.copy()

        all_names = self._extract_all_names(df)
        self.name_mapping = self._build_mapping(all_names)

        for column in self.columns:
            if column in df.columns:
                df[column] = df[column].apply(self._apply_mapping_to_cell)

        return df

    def _extract_all_names(self, df: DataFrame) -> Set[str]:
        all_names: Set[str] = set()

        for column in self.columns:
            if column not in df.columns:
                continue

            df[column].dropna().apply(
                lambda x: all_names.update(
                    name.strip() for name in str(x).split(",") if name.strip()
                )
            )

        return all_names

    def _build_mapping(self, all_names: Set[str]) -> Dict[str, str]:
        mapping: Dict[str, str] = {}
        processed: Set[str] = set()

        for name in all_names:
            if name in processed:
                continue

            matches = process.extract(name, all_names, scorer=fuzz.token_sort_ratio)

            # Filter by threshold
            similar = [match for match, score in matches if score >= self.threshold]

            # Choose canonical name (longest string)
            canonical = max(similar, key=len)

            for match in similar:
                mapping[match] = canonical
                processed.add(match)

        return mapping

    def _apply_mapping_to_cell(self, value: str) -> str:
        if not isinstance(value, str):
            return value

        names = value.split(",")

        unified = []
        for name in names:
            cleaned = name.strip()
            mapped = self.name_mapping.get(cleaned, cleaned)
            unified.append(mapped)

        return ", ".join(unified)
