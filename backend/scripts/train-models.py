"""CLI entry point to train ML models and run threshold analysis."""
from __future__ import annotations
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))

try:
    from app.ml.training.train import main
except Exception:
    print('Could not import training module. Make sure dependencies are installed.')
    raise

if __name__ == '__main__':
    try:
        main()
    except Exception as e:
        print('Training failed:', e)
        sys.exit(2)
    print('Training complete.')
