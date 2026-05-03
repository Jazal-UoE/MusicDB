from bs4 import BeautifulSoup
from wikiscraper.tables import table_to_dataframe
import pandas as pd


# def test_is_valid_dataframe():
#     df_empty = pd.DataFrame()
#     df_valid = pd.DataFrame({"A": [1, 2]})
#
#     assert not is_valid_dataframe(df_empty)
#     assert is_valid_dataframe(df_valid)


def test_table_to_dataframe_basic():
    html = """
      <body>
        <table>
          <tr><th>Song</th><th>Artist</th></tr>
          <tr><td>My Song</td><td>Me</td></tr>
        </table>
      </body>
    """

    soup = BeautifulSoup(html, "html.parser")
    table = soup.find("table")

    df = table_to_dataframe(table)
    assert df is not None
    assert df.shape == (1, 2)
    assert list(df.columns) == ["Song", "Artist"]


def test_table_to_dataframe_basic_empty():
    html = """<table><table/>"""
    soup = BeautifulSoup(html, "html.parser")
    table = soup.find("table")
    df = table_to_dataframe(table)
    assert df.empty
