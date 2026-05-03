import pandas as pd
from wikiscraper.entity_match import NameUnifier  # adjust import if needed


def test_single_name_no_change():
    df = pd.DataFrame({"composer": ["Gulzar"]})

    unifier = NameUnifier(columns=["composer"])
    result = unifier.unify(df)

    assert result["composer"].iloc[0] == "Gulzar"


def test_simple_fuzzy_match():
    df = pd.DataFrame({"composer": ["A R Rahman", "A. R. Rahman"]})

    unifier = NameUnifier(columns=["composer"], threshold=90)
    result = unifier.unify(df)

    values = set(result["composer"].tolist())

    # Both should map to same canonical (longest)
    assert len(values) == 1
    assert "A. R. Rahman" in values


def test_multiple_names_in_cell():
    df = pd.DataFrame({"composer": ["A R Rahman, Gulzar"]})

    unifier = NameUnifier(columns=["composer"], threshold=90)

    # Force mapping manually for clarity
    unifier.name_mapping = {"A R Rahman": "A. R. Rahman", "Gulzar": "Gulzar"}

    result = df.copy()
    result["composer"] = result["composer"].apply(unifier._apply_mapping_to_cell)

    assert result["composer"].iloc[0] == "A. R. Rahman, Gulzar"


def test_missing_column_ignored():
    df = pd.DataFrame({"lyricist": ["Gulzar"]})

    unifier = NameUnifier(columns=["composer"])
    result = unifier.unify(df)

    # Should not crash or modify dataframe
    assert "lyricist" in result.columns
    assert result.equals(df)


def test_nan_values_preserved():
    df = pd.DataFrame({"composer": ["A R Rahman", None]})

    unifier = NameUnifier(columns=["composer"])
    result = unifier.unify(df)

    assert pd.isna(result["composer"].iloc[1])


def test_threshold_prevents_wrong_merge():
    df = pd.DataFrame({"composer": ["Arijit Singh", "A. Singh"]})

    unifier = NameUnifier(columns=["composer"], threshold=95)
    result = unifier.unify(df)

    # Should NOT merge due to high threshold
    values = set(result["composer"].tolist())
    assert len(values) == 2


def test_duplicate_names_in_cell():
    df = pd.DataFrame({"composer": ["A R Rahman, A. R. Rahman"]})

    unifier = NameUnifier(columns=["composer"])
    result = unifier.unify(df)

    # Both should unify to same canonical
    assert result["composer"].iloc[0] == "A. R. Rahman, A. R. Rahman"


def test_mapping_consistency():
    df = pd.DataFrame({"composer": ["AR Rahman", "A R Rahman", "A. R. Rahman"]})

    unifier = NameUnifier(columns=["composer"])
    result = unifier.unify(df)

    values = result["composer"].unique()

    # All rows should map to same canonical
    assert len(values) == 1
