import os
import streamlit as st
from typing_extensions import TypedDict
class AnalyzerConfigs:
    '''
    This class contains configuration settings for the CodeAnalyzer class.
    '''
    gemini_models: list = [
        # INFO : https://ai.google.dev/gemini-api/docs/json-mode?lang=python
        "gemini-1.5-flash",
        "gemini-1.5-pro",
    ]
    famous_languages: list = ["Python", "Java", "JavaScript", "C++", "C#", "Ruby", "Go", "Swift", "Rust"]
    genai_api_key: str = os.getenv("GENAI_API_KEY")
    style_guides: dict = {
        'google_style': 'https://google.github.io/styleguide/pyguide.html',
        'pep8': 'https://pep8.org/',
    }

class ResponseData(TypedDict):
    '''
    For schema based responses like `JSON` or `Dict` objects, used TypedDict to define the structure of the response.
    '''
    line: int
    message: str
    severity: str
    start_char: int
    end_char: int  # Add this line to include the end_char in the response
