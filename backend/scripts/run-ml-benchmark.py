"""CLI entry point to run the fraud scenario benchmark.

Usage:
    python scripts/run-ml-benchmark.py
    python scripts/run-ml-benchmark.py --suite policy
    python scripts/run-ml-benchmark.py --suite challenge
    python scripts/run-ml-benchmark.py --suite all
"""
from __future__ import annotations
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))

try:
    from app.ml.evaluation.run_benchmark import main
except Exception:
    print('Could not import benchmark module. Make sure dependencies are installed.')
    raise

if __name__ == '__main__':
    main()
