# key_validator.py

import openai

def check_openai_key(key: str) -> bool:
    try:
        openai.api_key = key
        # Send a lightweight harmless test
        openai.Model.list()
        return True
    except Exception:
        return False
