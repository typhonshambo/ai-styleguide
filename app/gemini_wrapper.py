import sys
import json
from gemini_analyzer import CodeAnalyzer


def main():
    code = sys.argv[1]
    analyzer = CodeAnalyzer()
    analyzer.setCode(code)
    style_guide = analyzer.analyze_code()
    if style_guide:
        print(json.dumps({"style_guide": style_guide}))
    else:
        print(json.dumps({"error": "Analysis failed"}))


if __name__ == "__main__":
    main()
