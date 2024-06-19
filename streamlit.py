
import streamlit as st
from app.gemini_analyzer import analyze_code



st.title("AI-Powered Code Style Guide with Gemini")
code_input = st.text_area("Paste your code here:", height=250)

if st.button("Analyze"):
    if code_input:
        style_guide = analyze_code(code_input)

        st.subheader("Style Guide and Suggestions:")
        st.markdown(style_guide)  # Display the Gemini-generated style guide
    else:
        st.warning("Please paste your code to analyze.")