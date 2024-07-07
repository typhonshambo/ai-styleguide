import time
import streamlit as st
from app import CodeAnalyzer
import json

code_handler = CodeAnalyzer()

st.title("AI-Powered Code Style Guide with Gemini")
code_input = st.text_area("Paste your code here:", height=250)

if st.button("Analyze"):
    if code_input:
        with st.spinner('Analyzing...'):
            code_handler._input_code = code_input
            response = code_handler.analyze_code()
            data = json.loads(response)
            st.subheader("Style Guide and Suggestions:")
            # Expanders
            for items in data["issues"]:
                with st.expander(f"Line `{items['line']}`"):
                    st.write(items['message'])
            # JSON output
            st.subheader("Raw API response : ")
            with st.expander("Expand"):
                st.json(response)  # Display the Gemini-generated style guide
            time.sleep(5)
    else:
        st.warning("Please paste your code to analyze.")