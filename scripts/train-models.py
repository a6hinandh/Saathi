from __future__ import annotations
import sys
from pathlib import Path

# Ensure repo root is on sys.path so imports like backend.app... work when run from scripts/
ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))

try:
	from backend.app.ml.training.train import main
except Exception:
	print('Could not import training module. Make sure dependencies are installed.')
	raise


if __name__ == '__main__':
	try:
		main()
	except Exception as e:
		print('Training failed:', e)
		sys.exit(2)
	print('Training complete')
