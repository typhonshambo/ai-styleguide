import google.generativeai as genai
from typing import List
from .gemini_config import AnalyzerConfigs
import structlog

structlog.stdlib.recreate_defaults()
log = structlog.get_logger(__name__).info("module loaded successfully.")

__all__ = ["CodeAnalyzer"]

class CodeAnalyzer:
    def __init__(self) -> None:
        self.language: str = "python"
        self.style_guide: str = "google official"
        self.gemini_model = genai.GenerativeModel(
            AnalyzerConfigs.gemini_models[1],
            generation_config={
                "response_mime_type": "application/json",
            },
        )
        self._gen_ai_config = genai.configure(api_key=AnalyzerConfigs.genai_api_key)
        self._logger = structlog.get_logger("CodeAnalyzer")

    def analyze_code(self, lines: List[str]) -> str:
        """
        This method analyzes the input lines of code and generates a style guide using the Gemini model.
        """
        try:
            prompt = f'''Analyze the following {self.language} code according to {self.style_guide} style guidelines, the array below contains line-wise code:

            {lines}

            Please provide a detailed analysis, including:

            1. Specific violations message with line numbers.
            2. Suggestions for how to fix each violation, ideally with code examples.
            3. Prioritize Only the most critical issues for readability and maintainability.
            4. Mention start_char as well as end_char for highlighting the issue in the code.

            Using this JSON schema:
            response = {{"line": int, "message": str, "severity": str, "start_char": int, "end_char": int}}
            Return a `list[response]`
            '''

            model = self.gemini_model
            response = model.generate_content(prompt)

            # Extract and format the style guide from the response
            style_guide = response.text  # Adjust this based on the actual response structure
            self._logger.info("Style guide generated successfully.")
            self._logger.debug(style_guide)
            self._logger.debug(prompt)
            self._logger.debug(response)
            return style_guide

        except Exception as e:
            self._logger.error(f"Error generating style guide: {e}")
            return None
