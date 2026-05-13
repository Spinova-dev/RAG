from typing import Literal

from tiktoken import encoding_for_model


MODEL_PRICING_USD_PER_1K_TOKENS: dict[str, float] = {
    "gpt-4o-mini": 0.00015,
    "gpt-4o": 0.005,
}


def count_tokens(text: str, model: str) -> int:
    enc = encoding_for_model(model)
    return len(enc.encode(text))


def estimate_cost(tokens: int, model: str) -> float:
    rate = MODEL_PRICING_USD_PER_1K_TOKENS.get(model, 0.0)
    return round((tokens / 1000.0) * rate, 6)

