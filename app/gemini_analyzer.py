import google.generativeai as genai
from typing import Optional, Union, TypedDict

#for logging
import structlog
structlog.stdlib.recreate_defaults()
log = structlog.get_logger(__name__).info(f"module loaded successfully.")


class CodeAnalyzer:
  def __init__(self) -> None:
      from .gemini_config import AnalyzerConfigs, ResponseData #prevent circular import

      self.language: str[Optional] = "python"
      self.style_guide: str[Optional] = "google official"
      self.gemini_model = genai.GenerativeModel(
         AnalyzerConfigs.gemini_models[1],
         generation_config={
            "response_mime_type": "application/json",
            "response_schema": list[ResponseData]
         }
      )
      self._gen_ai_config = genai.configure(api_key=AnalyzerConfigs.genai_api_key)
      self._input_code: str = None
      self._prompt: str = None
      self._response: Union[list, None] = None
      self._logger = structlog.get_logger("CodeAnalyzer")

  def analyze_code(self) -> Union[list, None]:
      '''
      This method analyzes the input code and generates a style guide using the Gemini model.
      '''
      try:
        prompt = f"""Analyze the following {self.language} code according to {self.style_guide} style guidelines:

          ```{self.language}
          {self._input_code}
          ```

          Please provide a detailed analysis, including:

          1. Specific violations message with line numbers.
          2. Suggestions for how to fix each violation, ideally with code examples.
          3. Prioritize Only the most critical issues for readability and maintainability.
          """

        model = self.gemini_model
        response = model.generate_content(prompt)

        # Extract and format the style guide from the response
        # You will need to implement parsing logic here based on Gemini's response format

        style_guide = response.text  # Adjust this based on the actual response structure
        self._logger.info("Style guide generated successfully.")
        #self._logger.info(style_guide)
        return style_guide
      
      except Exception as e:
        self._logger.error(f"Error generating style guide: {e}")
        return None