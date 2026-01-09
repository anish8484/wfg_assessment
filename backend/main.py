from fastapi import FastAPI, BackgroundTasks, HTTPException, Depends, status
from sqlalchemy.orm import Session
from datetime import datetime
import asyncio
import models
import schemas
from database import engine, get_db

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

async def process_transaction(transaction_id: str, db: Session):
    """
    Simulates a long running process (30s) and updates the transaction status.
    Note: In a real production environment with multiple workers, 
    db sessions should be handled carefully within background tasks.
    We create a new session here to be safe.
    """
    # Simulate external processing
    await asyncio.sleep(30)
    
    # Ideally, we should get a fresh session
    # For simplicity in this assessment, we'll re-use the generator pattern or create a new one manually
    # Since background tasks run after the response, the original dependency session might be closed.
    # So we create a new session context.
    from database import SessionLocal
    new_db = SessionLocal()
    try:
        transaction = new_db.query(models.Transaction).filter(models.Transaction.transaction_id == transaction_id).first()
        if transaction:
            transaction.status = models.TransactionStatus.PROCESSED.value
            transaction.processed_at = datetime.utcnow()
            new_db.commit()
    finally:
        new_db.close()

@app.get("/")
async def health_check():
    return {"status": "HEALTHY", "current_time": datetime.utcnow().isoformat()}

@app.post("/v1/webhooks/transactions", status_code=status.HTTP_202_ACCEPTED)
async def receive_webhook(
    webhook: schemas.WebhookCreate, 
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    # Idempotency check
    existing_txn = db.query(models.Transaction).filter(models.Transaction.transaction_id == webhook.transaction_id).first()
    if existing_txn:
        # If already exists, we return 202 but don't re-process (or we could return 200/409, but 202 is safe)
        # Requirement: "handle this gracefully without errors or duplicate processing"
        # We will just return 202 and done.
        return {"message": "Transaction already received"}

    # Create new transaction
    new_txn = models.Transaction(
        transaction_id=webhook.transaction_id,
        source_account=webhook.source_account,
        destination_account=webhook.destination_account,
        amount=webhook.amount,
        currency=webhook.currency,
        status=models.TransactionStatus.RECEIVED.value,
        created_at=datetime.utcnow()
    )
    db.add(new_txn)
    db.commit()
    db.refresh(new_txn)

    # Trigger background processing
    background_tasks.add_task(process_transaction, new_txn.transaction_id, db)
    
    return {"message": "Transaction received"}

@app.get("/v1/transactions/{transaction_id}", response_model=list[schemas.TransactionResponse])
async def get_transaction(transaction_id: str, db: Session = Depends(get_db)):
    transaction = db.query(models.Transaction).filter(models.Transaction.transaction_id == transaction_id).first()
    if not transaction:
        # The example response shows a list, so I will return a list.
        # But normally if not found, 404.
        # Requirement says: Query Endpoint: GET /v1/transactions/{transaction_id}
        # Response: [{...}]
        return []
    return [transaction]
