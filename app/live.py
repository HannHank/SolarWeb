from flask_socketio import SocketIO, emit
from . import  loadData
from . import  predictBatteryVoltage as p
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
@socketio.on('predictDate_')
def predicitonDate_(message):
    print("message: ", message)
    result = p.predictBVoltage(int(message['entries']),int(message['Voltage']))
    emit("predictedDate_",{'Date':result['Date'],'score':result['score']})
    
