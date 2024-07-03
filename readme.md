<img src='https://img.shields.io/badge/Gemini-8E75B2?style=for-the-badge&logo=googlebard&logoColor=fff'>

# AI-Powered Personalized Code Style Guide

## Project Overview

This project aims to revolutionize the way developers maintain consistent code styles by leveraging the power of AI and the Gemini API. It will create a tool that generates personalized code style guides tailored to individual preferences, while also providing real-time feedback and suggestions to ensure code adherence.

## Problem Statement

Inconsistent code styles hinder collaboration, readability, and maintainability of software projects. Existing style guides are often rigid and don't adapt to individual preferences or project-specific requirements.

## Proposed Solution

Our solution is an AI-powered tool that:

1.  **Analyzes** a developer's code to identify their unique coding patterns and preferences.
2.  **Generates** a personalized style guide that aligns with the developer's style while adhering to common best practices.
3.  **Provides** real-time feedback and suggestions in the code editor to help developers maintain consistent code style.

## Demo
https://github.com/typhonshambo/ai-styleguide/assets/54593764/852f3357-a0b4-4313-9096-6d4ea19b2394

[![Streamlit App](https://img.shields.io/badge/Streamlit-FF4B4B?style=for-the-badge&logo=Streamlit&logoColor=white)](https://ai-styleguide.streamlit.app)


## Setup
 > For VS-code extension
1. Running the backend
```bash
pip3 install -r requirements.txt
python3 server.py
```
2. Running the extension locally
```bash
npm install
npm run compile
```
3. Run debugger to get a vs-code workspace installed with the extension to test out 

## Key Features

*   **Personalized Style Guide Generation:**  Analyzes code to identify common patterns and preferences, and generates a customized style guide.
*   **Real-Time Feedback:**  Provides suggestions for code formatting and style improvements as the developer writes code.
*   **IDE Integration:**  Integrates seamlessly with popular code editors for a smooth user experience.
*   **Customization:**  Allows users to tweak the generated style guide to match specific project requirements.
*   **Learning and Adaptation:**  Continuously learns and adapts to the user's coding style over time.

## Technical Approach

*   **NLP for Code Analysis:** Utilizes Natural Language Processing techniques like parsing, abstract syntax trees (ASTs), and transformer-based models (e.g., CodeBERT) to understand code structure and style.
*   **Gemini API Integration:**  Leverages Gemini's code generation and understanding capabilities to provide real-time feedback and suggestions.
*   **Flask Backend:**  Builds a robust backend with Flask to handle API requests, process data, and interact with Gemini.
*   **Streamlit Frontend:**  Creates a user-friendly interface with Streamlit where users can input code, view and customize their style guide, and receive real-time feedback.


## Team 

*   **Shambo Chowdhury:** Experienced in Python, C, SQL, and data science tools.


## Potential Impact

This project has the potential to significantly improve code quality, maintainability, and collaboration within development teams. By making code style consistent and easy to follow, it can lead to:

*   Reduced onboarding time for new team members
*   Faster debugging and troubleshooting
*   More efficient code reviews
*   Overall increased productivity

## Contribution

We welcome contributions from the community! If you're interested in contributing to our project, please check out our [GitHub repository](https://github.com/your-repo) for open issues. Feel free to assign yourself to any issue that you'd like to work on. We appreciate your help in making our project even better!

## Contact
For questions or collaboration opportunities, please contact Shambo Chowdhury.

