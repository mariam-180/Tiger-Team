# import socketio

# # Create a Socket.IO server with CORS settings
# sio = socketio.AsyncServer(async_mode='asgi', cors_allowed_origins=[
#     "http://localhost:3000",
#     "http://localhost",
#     "http://tigers-team.com",
#     "https://tigers-team.com",
#     "http://www.tigers-team.com",
#     "https://www.tigers-team.com"
# ])

# # Create an ASGI app
# app = socketio.ASGIApp(sio)

# @sio.event
# async def connect(sid, environ):
#     print('Client connected:', sid)

# @sio.event
# async def disconnect(sid):
#     print('Client disconnected:', sid)

# @sio.event
# async def message(sid, data):
#     print('Message from client:', data)
#     await sio.emit('message', 'Server response: ' + data)
