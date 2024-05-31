import asyncio
import websockets


async def hello():
    uri = "ws://localhost:8765/ws"  # Replace with your WebSocket server URI
    headers = {"api-key": "your_api_key_here"}  # Replace with your actual API key
    async with websockets.connect(uri, extra_headers=headers) as websocket:
        # Send a message to the server
        await websocket.send("Hello, Server!")
        print("Sent: Hello, Server!")

        # Receive a message from the server
        response = await websocket.recv()
        print(f"Received: {response}")


# Run the WebSocket client
asyncio.get_event_loop().run_until_complete(hello())
