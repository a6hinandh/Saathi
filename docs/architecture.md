# Architecture

Saathi is structured as a security overlay that can sit beside an existing banking portal.

## Layers

- Presentation: Innovate Bank internet banking portal and fraud operations dashboard.
- SDK layer: browser behavioral capture library that converts local interactions into privacy-preserving feature vectors.
- Risk layer: backend FastAPI service that evaluates behavior, transaction context, note semantics, and device risk.
- Decision layer: weighted fusion plus policy engine that returns allow, warning, step-up, or block.
- Visibility layer: fraud dashboard that explains each decision and keeps a record of alerts.

## Key properties

- No raw passwords or raw keystrokes are stored.
- Raw mouse coordinates are not persisted.
- Suspicious note text is classified using TF-IDF and logistic regression.
- Behavioral anomaly uses Isolation Forest on engineered features.
- Coercion detection uses rules and fused signals to explain scam-guided payment risk.

## Demo posture

The prototype is intentionally realistic for a public-sector bank environment. It shows how Saathi would integrate into a pre-existing internet banking stack rather than replacing that stack.
