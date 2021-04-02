from flask_socketio import SocketIO, emit

socketio = SocketIO()


@socketio.on("pingServer")
def pingServer(message):
    emit("pingResponse", {"data": "PONG"})
