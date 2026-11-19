from fastapi import APIRouter, WebSocket, HTTPException, Depends, status
from sqlmodel import Session

from src.api.dependencies import get_db

ws_router = APIRouter()


@ws_router.websocket("/stream")
async def video_stream(websocket: WebSocket, session: Session = Depends(get_db)):
    try:
        await websocket.accept()

        await websocket.send_text("WebSocket connection established for video streaming")

        # Start video streaming
        # Example: Send video frames in a loop
        # while True:
        #     video_frame = get_next_video_frame()  # Get video frame from camera or source
        #     await websocket.send_bytes(video_frame)  # Send video frame as bytes
    except Exception as e:
        # Handle exceptions and close WebSocket connection if necessary
        await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))
