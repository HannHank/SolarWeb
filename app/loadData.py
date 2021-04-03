import pandas as pd
from pymodbus.client.sync import ModbusSerialClient as ModbusClient
from datetime import * 
import json
class SolarStation():
    def __init__(self):
        print("init solar")
    def loadHistory(self,DateFrom, DateTo=datetime.now().replace(second=0, microsecond=0)):
        #DateFrom = datetime.strptime('2021-04-03 06:19:00', '%Y-%m-%d %H:%M:%S')
        if(DateTo == ''):
            DateTo=datetime.now().replace(second=0, microsecond=0)
        
        df = pd.read_csv('./data.csv',parse_dates=[0])   
        #df.Date = pd.to_datetime(df.Date, format = '%Y-%m-%d %H:%M:%S')
        # df.Date= df.Date.apply(lambda x: 
        #                             datetime.strptime(x,'%Y-%m-%d %H:%M:%S'))
       
        df = df.query("Date >=  '" + str(DateFrom) + "' and Date <= '" + str(DateTo) + "'")
        #df = df[(df.Date > DateFrom) & (df.Date > a)]
        #data = df.assign(**df.select_dtypes(['datetime']).astype(str).to_dict('list')).to_json(orient="records") #date_format = "iso" # df.to_json(orient = "records") 
        data= {}

        df.Date = df.Date.dt.strftime('%Y-%m-%d %H:%M:%S')

        #df.Date.apply(datetime.strftime('%Y-%m-%d %H:%M:%S'))
        #pd.strftime()
        #pd.to_datetime(pd.Series(df.Date))
        #df['Date'] = df.loc['Date'].dt.strftime('%Y-%m-%d %H:%M:%S')
        df = df.to_dict()
        # data['SolarVoltage'] =list(df.Date)
        # data['SolarCurrent']  =list(df.Date)
        # data['BattVoltage'] = list(df.Date)
        # data['BattCurrent'] = list(df.Date)
        # data['LoadCurrent'] = df.LoadCurrent.toList()
        
        return  df
    def loadLiveData(self,port="dev/ttyRSX0"):
        try:
            client = ModbusClient(method = 'rtu', port = port, baudrate = 115200)
            client.connect()
            print( client)
            data = {}
            
            # Solarvoltage
            result = client.read_input_registers(0x3100,15,unit=1)
            data[datetime.now().replace(second=0, microsecond=0)]['SolarVoltage'] = float(result.registers[0] / 100.0)
            #SolarCurrent
        
            Date = datetime.now().replace(second=0, microsecond=0)
            data[Date]['SolarCurrent'] = float(result.registers[1] / 100.0)
            #BatteryVoltage
            
            data[Date]['BattVoltage'] = float(result.registers[4] / 100.0)
            #ChargeCurrent
        
            data[Date]['BattCurrent'] = float(result.registers[5] / 100.0)
            #loadCurrent
        
            data[Date]['loadCurrent'] = float(result.registers[9] / 100.0)
            #Watt
            
            data[Date]['Watt'] = float(result.registers[10] / 100.0)
            #Watt_ToDay
            
            data[Date]['Watt_ToDay'] = float(result.registers[0] / 100.0)
            #Soc
        
            data[Date]['Soc'] = int(result.registers[0])
            
                

            client.close()
            return data
        except:
            # could not read data from station

            return {"Date":"2021-04-03 06:34:00","SolarVoltage":19.32,"SolarCurrent":0.0,"BattVoltage":25.36,"BattCurrent":0.0,"LoadCurrent":0.0}

