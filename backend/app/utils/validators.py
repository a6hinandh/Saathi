from .helpers import bounded


def normalize_amount(amount: float) -> float:
    return bounded(amount / 50000.0)
