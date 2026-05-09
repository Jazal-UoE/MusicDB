from typing import List, Dict, Set, Tuple, Any
from pandas import DataFrame
from fuzzywuzzy import process, fuzz


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

            for cell in df[column].dropna():
                if isinstance(cell, list):
                    all_names.update(str(name).strip() for name in cell if name)

        return all_names

    def _build_mapping(self, all_names: Set[str]) -> Dict[str, str]:
        mapping: Dict[str, str] = {}
        processed: Set[str] = set()

        for name in all_names:
            if name in processed:
                continue

            matches = process.extract(
                name, list(all_names), scorer=fuzz.token_sort_ratio
            )

            # Filter by threshold
            similar = []
            for match, score in matches:
                if score >= self.threshold:
                    similar.append(match)

            # Choose canonical name (longest string)
            canonical = max(similar, key=len)

            for match in similar:
                mapping[match] = canonical
                processed.add(match)

        return mapping

    def _apply_mapping_to_cell(self, value) -> list:
        if not isinstance(value, list):
            return value

        unified = []
        for name in value:
            if isinstance(name, str):
                cleaned = name.strip()
                unified.append(self.name_mapping.get(cleaned, cleaned))
        return unified
