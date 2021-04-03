import pandas as pd
from datetime import * 
class SolarStation():
    def __init__(self):
        print("init solar")
    def loadHistory(self,DateFrom, DateTo=datetime.now().replace(second=0, microsecond=0)):
        #DateFrom = datetime.strptime('2021-04-03 06:19:00', '%Y-%m-%d %H:%M:%S')
        df = pd.read_csv('./data.csv')   
        #df.Date = pd.to_datetime(df.Date, format = '%Y-%m-%d %H:%M:%S')
        df.Date= df.Date.apply(lambda x: 
                                    datetime.strptime(x,'%Y-%m-%d %H:%M:%S'))
       
        df = df.query("Date >=  '" + str(DateFrom) + "' and Date <= '" + str(DateTo) + "'")
        #df = df[(df.Date > DateFrom) & (df.Date > a)]
        data =df.assign(**df.select_dtypes(['datetime']).astype(str).to_dict('list')).to_json(orient="records") #date_format = "iso" # df.to_json(orient = "records") 
        return data
    def loadLiveData(self,port="dev/ttyRSX0"):
        client = ModbusClient(method = 'rtu', port = port, baudrate = 115200)
        client.connect()
        print( client)
        result = client.read_input_registers(0x3100,6,unit=1)


