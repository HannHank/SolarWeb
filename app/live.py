from flask_socketio import SocketIO, emit
from . import  loadData
socketio = SocketIO()


@socketio.on("pingServer")
def pingServer(message):
    emit("pingResponse", {"data": "PONG"})

@socketio.on("loadData")
def pingServer(message):
    print(message)
    solar = loadData.SolarStation()
    data = solar.loadHistory(message['DateFrom'], message['DateTo'])
    data['Date'] = str(data['Date'])
    
    print(type(data))
    emit("loadedData", data )

@socketio.on("liveData")
def pingServer():
    solar = loadData.SolarStation()
    data = solar.loadLiveData()
    print(data)
    if(data == False):
       emit("loadedLiveData", {"data": data,"errMsg":"Could not read Data from Station"})
    else:
       emit("loadedLiveData", {"data": data,"errMsg":""})