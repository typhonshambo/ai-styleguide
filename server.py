from flask import Flask, request, jsonify
from app import CodeAnalyzer
import json

app = Flask(__name__)


@app.route("/analyze", methods=["POST"])
def analyze():
    data = request.get_json()
    code = data["code"]

    analyzer = CodeAnalyzer()
    analyzer._input_code = code
    style_guide = analyzer.analyze_code()
    processed_stule_guide = json.loads(style_guide)
    issues = {"issues": processed_stule_guide}
    if style_guide:
        # data = json.loads(style_guide) # Convert string to dictionary
        return jsonify({"style_guide": issues}), 200
    else:
        return jsonify({"error": "Analysis failed"}), 500


if __name__ == "__main__":
    app.run(port=5000)
