from fastapi import FastAPI, Request
from app import CodeAnalyzer
import json

app = FastAPI()

@app.post("/analyze")
async def analyze(request: Request):
    data = await request.json()
    lines = data["lines"]  # Get the lines from the request data

    analyzer = CodeAnalyzer()
    style_guide = analyzer.analyze_code(lines)

    if style_guide:
        processed_style_guide = json.loads(style_guide)
        issues = {"issues": processed_style_guide}
        return {"style_guide": issues}
    else:
        return {"error": "Analysis failed"}, 400

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5000)
