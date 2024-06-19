import ast

def analyze_code(code):
    tree = ast.parse(code)

    features = {}

    # Indentation Analysis
    indentations = []
    for node in ast.walk(tree):
        if isinstance(node, (ast.FunctionDef, ast.ClassDef, ast.AsyncFunctionDef)):
            indentations.append(node.col_offset)

    if indentations:
        indent_type = "spaces" if code[indentations[0] - 1] == " " else "tabs"
        indent_size = indentations[0]

        # Check for consistent indentation (optional)
        for indent in indentations[1:]:
            if indent != indent_size:
                indent_size = "inconsistent"
                break

        features["indent_type"] = indent_type
        features["indent_size"] = indent_size

    # Naming Convention Analysis
    snake_case_vars = 0
    snake_case_funcs = 0
    total_vars = 0  # Count total variables to avoid division by zero
    for node in ast.walk(tree):
        if isinstance(node, ast.Name) and isinstance(node.ctx, ast.Store):
            total_vars += 1
            if node.id.islower() and "_" in node.id:
                snake_case_vars += 1
        elif isinstance(node, ast.FunctionDef):
            if node.name.islower() and "_" in node.name:
                snake_case_funcs += 1

    features["naming_conventions"] = {
        "variables": {
            "snake_case": f"{100 * snake_case_vars / total_vars:.0f}%" if total_vars > 0 else "0%",
            "other": f"{100 * (1 - snake_case_vars / total_vars):.0f}%" if total_vars > 0 else "100%"
        },
        "functions": {
            "snake_case": "100%" if snake_case_funcs > 0 else "0%"
        }
    }
    print(features)
    return features

