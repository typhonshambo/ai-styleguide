
import streamlit as st
from app.gemini_analyzer import CodeAnalyzer

code_handler = CodeAnalyzer()


st.title("AI-Powered Code Style Guide with Gemini")
code_input = st.text_area("Paste your code here:", height=250)

if st.button("Analyze"):
    if code_input:
        code_handler._input_code = code_input
        response = code_handler.analyze_code()

        st.subheader("Style Guide and Suggestions:")
        st.markdown(response)  # Display the Gemini-generated style guide
    else:
        st.warning("Please paste your code to analyze.")