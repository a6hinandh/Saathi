def bounded(value: float, lower: float = 0.0, upper: float = 1.0) -> float:
    return max(lower, min(upper, value))


def percent_to_score(value: float) -> int:
    return max(0, min(100, int(round(value * 100))))
