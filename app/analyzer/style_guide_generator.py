def generate_style_guide(features):
    style_guide = {}

    if "indent_type" in features:
        style_guide["Indentation"] = {
            "Type": features["indent_type"].capitalize(),
            "Size": features["indent_size"]
        }

    if "naming_conventions" in features:
        style_guide["Naming Conventions"] = {}
        for category, counts in features["naming_conventions"].items():
            total = counts["snake_case"] + counts["other"]
            if total > 0:
                snake_case_percent = (counts["snake_case"] / total) * 100
                style_guide["Naming Conventions"][category] = {
                    "snake_case": f"{snake_case_percent:.0f}%"
                }

    return style_guide
