from flask_socketio import SocketIO, emit
from . import  loadData
socketio = SocketIO()


@socketio.on("pingServer")
def pingServer(message):
    emit("pingResponse", {"data": "PONG"})

@socketio.on("loadData")
def pingServer(message):
    solar = loadData.SolarStation()
    data = solar.loadHistory('2021-04-03 06:34:00','2021-04-03 08:34:00')
    print(len(data))
    emit("loadedData", {"data": data })
