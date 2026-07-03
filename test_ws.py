import asyncio
import websockets
import json

async def test_connection():
    uri = "ws://localhost:8000/ws/telemetry"
    try:
        async with websockets.connect(uri) as websocket:
            print("Connected to telemetry websocket.")
            # Receive one message
            msg = await websocket.recv()
            data = json.loads(msg)
            print("Received data:")
            print(json.dumps(data, indent=2))
            return True
    except Exception as e:
        print(f"Failed to connect: {e}")
        return False

if __name__ == "__main__":
    asyncio.run(test_connection())
