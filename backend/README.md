# Backend

FastAPI risk engine for Saathi.

## Stack

- FastAPI
- Python 3.11
- scikit-learn
- pandas
- numpy
- uvicorn
- pydantic

## Run locally

```bash
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

## API

- `GET /health`
- `POST /risk/evaluate`
- `GET /dashboard/alerts`
- `GET /dashboard/stats`

The backend is structured into API routes, services, ML artifacts, dashboard helpers, and tests.
