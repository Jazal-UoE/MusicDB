import pytest
from pandas import DataFrame

from wikiscraper.language.persian import PersianLanguageStrategy
from wikiscraper.normalise import Normaliser
from wikiscraper.models.artist import Artist


@pytest.fixture
def normaliser():
    return Normaliser(
        strategy=PersianLanguageStrategy(),
        artist=Artist(
            name="Ebi",
            url="https://fa.wikipedia.org/wiki/%D8%AA%D8%B1%D8%A7%D9%86%D9%87%E2%80%8C%D8%B4%D9%86%D8%A7%D8%B3%DB%8C_%D8%A7%D8%A8%DB%8C",
        ),
    )


def test_normalise_table_all_columns_present(normaliser):
    data = {
        "ترانه": ["Song1"],
        "آهنگساز": ["Composer1"],
        "ترانهسرا": ["Writer1"],
        "تنظیم": ["Tuning1"],
    }

    df = DataFrame(data)

    result = normaliser._normalise_table(df)

    assert list(result.columns) == ["song_name", "composer", "song_writer", "tuning"]
    assert len(result) == 1

    assert result.iloc[0]["song_name"] == "Song1"
    assert result.iloc[0]["composer"] == "Composer1"
    assert result.iloc[0]["song_writer"] == "Writer1"
    assert result.iloc[0]["tuning"] == "Tuning1"


def test_normalise_table_missing_columns(normaliser):
    data = {
        "ترانه": ["Song1"],
        "آهنگساز": ["Composer1"],
    }

    df = DataFrame(data)

    result = normaliser._normalise_table(df)

    assert list(result.columns) == ["song_name", "composer", "song_writer", "tuning"]

    assert len(result) == 1

    assert result.iloc[0]["song_name"] == "Song1"
    assert result.iloc[0]["composer"] == "Composer1"
    assert result.iloc[0]["song_writer"] is None
    assert result.iloc[0]["tuning"] is None


def test_normalise_table_partial_match_column_names(normaliser):
    data = {
        "نام ترانه": ["Song1"],
        "آهنگساز اصلی": ["Composer1"],
    }

    df = DataFrame(data)

    result = normaliser._normalise_table(df)

    assert len(result) == 1

    assert result.iloc[0]["song_name"] == "Song1"
    assert result.iloc[0]["composer"] == "Composer1"


def test_normalise_tables_multiple(normaliser):
    df1 = DataFrame(
        {
            "ترانه": ["Song1"],
            "آهنگساز": ["Composer1"],
        }
    )

    df2 = DataFrame(
        {
            "ترانه": ["Song2"],
            "آهنگساز": ["Composer2"],
        }
    )

    results = normaliser.normalise_tables([df1, df2])

    assert len(results) == 2

    assert results[0].iloc[0]["song_name"] == "Song1"
    assert results[1].iloc[0]["song_name"] == "Song2"
