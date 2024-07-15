from typing_extensions import TypedDict


class ResponseData(TypedDict):
    """
    For schema based responses like `JSON`
    """

    line: int
    message: str
    severity: str
    start_char: int
    end_char: int
