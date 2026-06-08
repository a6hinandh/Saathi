import json
from sqlalchemy import Column, Integer, String, Float
from ..database import Base


class Alert(Base):
    __tablename__ = "alerts"

    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(String, index=True)
    session_id = Column(String, index=True)
    beneficiary = Column(String)
    amount = Column(Float)
    risk_score = Column(Integer)
    risk_level = Column(String)
    action = Column(String)
    coercion_label = Column(String)
    summary = Column(String)
    _explanation = Column(String, name="explanation")  # Stored as JSON string
    timestamp = Column(String)

    @property
    def explanation(self) -> list[str]:
        if not self._explanation:
            return []
        try:
            return json.loads(self._explanation)
        except Exception:
            return [self._explanation]

    @explanation.setter
    def explanation(self, value: list[str]) -> None:
        self._explanation = json.dumps(value)
