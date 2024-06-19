import google.generativeai as genai
import streamlit as st

genai.configure(api_key=st.secrets["GENAI_API_KEY"])

def analyze_code(code, language="python"):
    prompt = f"""Analyze the following Python code according to PEP 8 style guidelines:

    ```python
    {code}
    ```

    Please provide a detailed analysis, including:

    1. Specific PEP 8 violations with line numbers.
    2. Suggestions for how to fix each violation, ideally with code examples.
    3. Prioritize the most critical issues for readability and maintainability.
    """

    model = genai.GenerativeModel("gemini-1.5-flash")
    response = model.generate_content(prompt)

    # Extract and format the style guide from the response
    # You will need to implement parsing logic here based on Gemini's response format

    style_guide = response.text  # Adjust this based on the actual response structure

    return style_guide