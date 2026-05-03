from bs4 import BeautifulSoup
import requests
from requests import Response


def fetch_and_parse_html(url: str) -> BeautifulSoup:
    html = fetch_html(url)
    print(html.text)
    soup = parse_html(html.text)
    return soup


def fetch_html(url: str) -> Response:
    headers = {"User-Agent": "MusicDBScraper/0.1 (+https://your-website-or-email)"}
    return requests.get(url, headers=headers)


def parse_html(html: str) -> BeautifulSoup:
    return BeautifulSoup(html, "html.parser")
