from sqlalchemy import Column, String, Float, DateTime, Enum as SqlEnum
from database import Base
import datetime
import enum

class TransactionStatus(str, enum.Enum):
    RECEIVED = "RECEIVED"
    PROCESSING = "PROCESSING"
    PROCESSED = "PROCESSED"
    FAILED = "FAILED"

class Transaction(Base):
    __tablename__ = "transactions"

    transaction_id = Column(String, primary_key=True, index=True)
    source_account = Column(String)
    destination_account = Column(String)
    amount = Column(Float)
    currency = Column(String)
    status = Column(String, default=TransactionStatus.RECEIVED.value)
    
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    processed_at = Column(DateTime, nullable=True)
