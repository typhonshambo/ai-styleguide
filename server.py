from fastapi import FastAPI, Request
from app import CodeAnalyzer
import json

app = FastAPI()


@app.post("/analyze")
async def analyze(request: Request):
    data = await request.json()
    code = data["code"]

    analyzer = CodeAnalyzer()
    analyzer._input_code = code
    style_guide = analyzer.analyze_code()
    processed_style_guide = json.loads(style_guide)
    issues = {"issues": processed_style_guide}
    if style_guide:
        return {"style_guide": issues}
    else:
        return {"error": "Analysis failed"}, 400


if __name__ == "__main__":
    app.run(port=5000)
