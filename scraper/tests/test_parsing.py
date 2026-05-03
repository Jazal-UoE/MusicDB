from bs4 import BeautifulSoup
from pandas import DataFrame
from wikiscraper.models.artist import Artist
from wikiscraper.parsing import Parser
from wikiscraper.language.persian import PersianLanguageStrategy
import pytest


@pytest.fixture
def parser():
    return Parser(
        strategy=PersianLanguageStrategy(),
        artist=Artist(
            name="Ebi",
            url="https://fa.wikipedia.org/wiki/%D8%AA%D8%B1%D8%A7%D9%86%D9%87%E2%80%8C%D8%B4%D9%86%D8%A7%D8%B3%DB%8C_%D8%A7%D8%A8%DB%8C",
        ),
    )


def test_is_metadata_table_empty(parser):
    df = DataFrame()
    assert not parser._is_metadata_table(df)


def test_is_metadata_table_valid_and_present(parser):
    data = {"ترانه": ["Song1", "Song2"], "Composer": ["Composer1", "Composer2"]}
    df = DataFrame(data)

    assert parser._is_metadata_table(df)


def test_is_metadata_table_valid_and_not_present(parser):
    data = {"SongColumn": ["Song1", "Song2"], "Composer": ["Composer1", "Composer2"]}
    df = DataFrame(data)

    assert not parser._is_metadata_table(df)


def test_find_all_metadata_tables(parser):
    html = """
    <html>
        <body>
            <table>
                <tr><th>ترانه</th><th>Composer</th></tr>
                <tr><td>Song1</td><td>Composer1</td></tr>
            </table>
            <table>
                <tr><th>NotSong</th><th>Composer</th></tr>
                <tr><td>Data1</td><td>Composer2</td></tr>
            </table>
            <table>
                <tr><th>ترانه</th><th>Composer</th></tr>
                <tr><td>Song2</td><td>Composer3</td></tr>
            </table>
        </body>
    </html>
    """

    soup = BeautifulSoup(html, "html.parser")
    metadata_tables = parser._find_all_metadata_tables(soup)

    assert len(metadata_tables) == 2

    assert "ترانه" in metadata_tables[0].columns
    assert "Composer" in metadata_tables[0].columns

    assert "ترانه" in metadata_tables[1].columns
    assert "Composer" in metadata_tables[1].columns

    df0: DataFrame = metadata_tables[0]
    assert df0.iloc[0]["ترانه"] == "Song1"
    assert df0.iloc[0]["Composer"] == "Composer1"

    df1: DataFrame = metadata_tables[1]
    assert df1.iloc[0]["ترانه"] == "Song2"
    assert df1.iloc[0]["Composer"] == "Composer3"
