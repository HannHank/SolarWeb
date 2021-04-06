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
    emit("loadedData", data )

@socketio.on("liveData")
def pingServer(message):
    print(message)        
    solar = loadData.SolarStation()
    data = solar.loadLiveData(message['lastDate'])
    print(data)
    emit("loadedLiveData", {"data": data,"errMsg":"Could not read Data from Station"})
    # if(data == False):
    #    emit("loadedLiveData", {"data": data,"errMsg":"Could not read Data from Station"})
    # else:
    #    emit("loadedLiveData", {"data": data,"errMsg":""})