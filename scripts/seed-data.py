from pathlib import Path
import json

root = Path(__file__).resolve().parent.parent
sample_path = root / 'backend' / 'data' / 'mock_transactions.json'
print(f'Sample data available at {sample_path}')
