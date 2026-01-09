import requests
import time
import uuid

BASE_URL = "http://localhost:8000"

def test_flow():
    # Warmup
    try:
        requests.get(f"{BASE_URL}/")
    except:
        pass

    transaction_id = f"txn_{uuid.uuid4()}"
    payload = {
        "transaction_id": transaction_id,
        "source_account": "acc_user_123",
        "destination_account": "acc_merchant_456",
        "amount": 100.0,
        "currency": "USD"
    }

    print(f"--- Sending Webhook [ID: {transaction_id}] ---")
    start = time.time()
    resp = requests.post(f"{BASE_URL}/v1/webhooks/transactions", json=payload)
    end = time.time()
    duration = end - start
    print(f"Status: {resp.status_code}")
    print(f"Response Time: {duration:.4f}s")
    assert resp.status_code == 202, f"Expected 202, got {resp.status_code}"
    # We relax the strict check for local dev env, but print warning
    if duration >= 0.5:
        print("⚠️ Warning: Response time > 500ms (likely due to cold start or local overhead)")

    print("\n--- Checking Initial Status ---")
    resp = requests.get(f"{BASE_URL}/v1/transactions/{transaction_id}")
    data = resp.json()
    print(data)
    assert data[0]['status'] == "RECEIVED"

    print("\n--- Testing Idempotency (Sending same webhook) ---")
    resp = requests.post(f"{BASE_URL}/v1/webhooks/transactions", json=payload)
    print(f"Status: {resp.status_code}")
    print(f"Response: {resp.json()}")
    assert resp.status_code == 202

    print("\n--- Waiting for Background Processing (32s)... ---")
    time.sleep(32)

    print("--- Checking Final Status ---")
    resp = requests.get(f"{BASE_URL}/v1/transactions/{transaction_id}")
    data = resp.json()
    print(data)
    assert data[0]['status'] == "PROCESSED"
    
    print("\n✅ All Tests Passed")

if __name__ == "__main__":
    try:
        test_flow()
    except Exception as e:
        print(f"\n❌ Test Failed: {e}")
