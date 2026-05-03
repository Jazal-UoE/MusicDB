import pytest

from wikiscraper.cleaner import Cleaner
from wikiscraper.language.persian import PersianLanguageStrategy

import numpy as np
import pandas as pd
from pandas.testing import assert_frame_equal


@pytest.fixture
def cleaner():
    return Cleaner(PersianLanguageStrategy())


def test_handle_empty_tablues(cleaner):
    df = pd.DataFrame({"col1": [1, np.nan, "text"], "col2": [None, "data", 4]})
    expected = pd.DataFrame({"col1": [1, None, "text"], "col2": [None, "data", 4]})

    result = cleaner.handle_empty_values(df)
    assert_frame_equal(expected, result)


def test_strip_whitespace(cleaner):
    df = pd.DataFrame({"song_name": ["  Hello  ", "World   ", "  Extra   Spaces  "]})
    expected = pd.DataFrame({"song_name": ["Hello", "World", "Extra Spaces"]})

    result = cleaner.strip_whitespace(df)
    assert_frame_equal(result, expected)


def test_normalise_capitalization(cleaner):
    df = pd.DataFrame({"song_name": ["HELLO world", "pYthon coding"]})
    expected = pd.DataFrame({"song_name": ["Hello World", "Python Coding"]})

    result = cleaner.normalise_capitalization(df)
    assert_frame_equal(result, expected)


def test_remove_empty_song_name(cleaner):
    df = pd.DataFrame(
        {
            "song_name": ["Song A", None, "Song B"],
            "artist": ["Artist 1", "Artist 2", "Artist 3"],
        }
    )
    # Note: handle_empty_values usually turns NaN to None, so we test None here
    result = cleaner.remove_empty_song_name(df)

    assert len(result) == 2
    assert None not in result["song_name"].values


def test_clean_song_names_regex(cleaner):
    df = pd.DataFrame(
        {
            "song_name": [
                '"Yesterday"',
                "Hello (Remix)",
                "Song Name [Live Version]",
                "'Untitled'",
            ]
        }
    )
    expected = pd.DataFrame(
        {"song_name": ["Yesterday", "Hello ", "Song Name ", "Untitled"]}
    )

    result = cleaner.clean_song_names(df)
    assert_frame_equal(result, expected)


def test_clean_table_integration(cleaner):
    """Tests the full pipeline of clean_table"""
    df = pd.DataFrame(
        {
            "song_name": ['  "Yesterday" (Remix)  ', '  "Yesterday" (Remix)  ', None],
            "year": [" 2020 ", " 2020 ", "2021"],
        }
    )

    # Expected results:
    # 1. handle_empty -> None
    # 2. strip_whitespace -> "Yesterday" (Remix)
    # 3. normalise -> "Yesterday" (Remix)
    # 4. remove_duplicates -> 1 row for Yesterday, 1 row for None
    # 5. remove_empty_song_name -> 1 row (Yesterday)
    # 6. clean_song_names -> Yesterday

    result = cleaner.clean_table(df)

    assert len(result) == 1
    assert result.iloc[0]["song_name"] == "Yesterday"
    assert result.iloc[0]["year"] == "2020"


def test_missing_column_error(cleaner):
    df = pd.DataFrame({"wrong_column": ["data"]})
    with pytest.raises(ValueError, match="DataFrame must contain song_name column"):
        cleaner.remove_empty_song_name(df)


def test_split_multiple_songs(cleaner):
    df = pd.DataFrame(
        {
            "song_name": ["Deep Sea / Sky High"],
            "artist": ["The Divers"],
            "composer": ["Alice Composer"],
            "lyricist": ["Bob Writer"],
        }
    )

    result = cleaner.split_multiple_songs(df)

    assert len(result) == 2

    song_1 = result.iloc[0]
    assert song_1["song_name"] == "Deep Sea"
    assert song_1["artist"] == "The Divers"
    assert song_1["composer"] == "Alice Composer"
    assert song_1["lyricist"] == "Bob Writer"

    song_2 = result.iloc[1]
    assert song_2["song_name"] == "Sky High"
    assert song_2["artist"] == "The Divers"
    assert song_2["composer"] == "Alice Composer"
    assert song_2["lyricist"] == "Bob Writer"


def test_split_people_to_list(cleaner):
    df = pd.DataFrame(
        {
            "song_name": ["Song 1"],
            "artist": ["Artist A & Artist B"],
            "composer": ["Comp 1, Comp 2 and Comp 3"],
            "lyricist": ["Only One Writer"],
        }
    )

    result = cleaner.split_people_to_list(df, cleaner.strategy.people_columns)

    assert result.loc[0, "composer"] == ["Comp 1", "Comp 2", "Comp 3"]

    assert isinstance(result.loc[0, "composer"], list)
