import streamlit as st


class AnalyzerConfigs:
    """
    This class contains configuration settings for the CodeAnalyzer class.
    """

    gemini_models: list = [
        "gemini-1.5-flash",
        "gemini-1.5-pro",  # INFO : https://ai.google.dev/gemini-api/docs/json-mode?lang=python
    ]
    famous_languages: list = [
        "Python",
        "Java",
        "JavaScript",
        "C++",
        "C#",
        "Ruby",
        "Go",
        "Swift",
        "Rust",
    ]
    genai_api_key: str = st.secrets("GENAI_API_KEY")
    style_guides: dict = {
        "google style": "https://google.github.io/styleguide/pyguide.html",
        "pep8": "https://pep8.org/",
    }
