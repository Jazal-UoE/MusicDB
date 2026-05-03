from typing import Optional
import pandas as pd
from bs4 import Tag
from io import StringIO
from pandas import DataFrame


def testTable():
    print("we working")


def table_to_dataframe(table: Optional[Tag]) -> DataFrame:
    if table is None:
        return DataFrame()

    try:
        return extract_first_table(table)

    except (ValueError, IndexError):
        return DataFrame()


def extract_first_table(table: Tag) -> DataFrame:
    html = str(table)
    return pd.read_html(StringIO(html), flavor="bs4")[0]


# def is_valid_dataframe(df: DataFrame) -> bool:
#     return False if df.empty else True
