import pandas as pd
from pymodbus.client.sync import ModbusSerialClient as ModbusClient
from datetime import * 
import json
import random

class SolarStation():
    def __init__(self):
        print("init solar")
    def loadHistory(self,DateFrom, DateTo=datetime.now().replace(second=0, microsecond=0),updating='0'):
        #DateFrom = datetime.strptime('2021-04-03 06:19:00', '%Y-%m-%d %H:%M:%S')
        if(DateTo == ''):
            DateTo=datetime.now().replace(second=0, microsecond=0)
       

        df = pd.read_csv('./data.csv',parse_dates=[0])   
    
        #df.Date = pd.to_datetime(df.Date, format = '%Y-%m-%d %H:%M:%S')
        # df.Date= df.Date.apply(lambda x: 
        #                             datetime.strptime(x,'%Y-%m-%d %H:%M:%S'))
        upDate = DateFrom
        if updating == '1':
            upDate = datetime.strptime(DateFrom, "%Y-%m-%d %H:%M:%S")
            print("Date",upDate)
            upDate = upDate  + timedelta(minutes=6)
            print("Date after", upDate)
            upDate = upDate.strftime('%Y-%m-%d %H:%M:%S')

        df = df.query("Date >=  '" + str(DateFrom) + "' and Date <= '" + str(DateTo) + "'")
        #df = df[(df.Date > DateFrom) & (df.Date > a)]
        #data = df.assign(**df.select_dtypes(['datetime']).ast  ype(str).to_dict('list')).to_json(orient="records") #date_format = "iso" # df.to_json(orient = "records") 
        # this code is not very efficient, but pandas sucks... TODO
        Dates = []
        SolarVoltage = []
        SolarCurrent = []
        BattVoltage = []
        BattCurrent = []
        LoadCurrent = []
        for index, row in df.iterrows():
            Dates.append(row[0].strftime('%Y-%m-%d %H:%M:%S'))
            SolarVoltage.append(row[1])
            SolarCurrent.append(row[2])
            BattVoltage.append(row[3])
            BattCurrent.append(row[4])
            LoadCurrent.append(row[5])

        #for idx, val in enumerate(df.columns):
               
               # test[val].append(row[idx])
            
        #df.Date = df.Date.dt.strftime('%Y-%m-%d %H:%M:%S')
        #print("test",Dates)
        #df.Date.apply(datetime.strftime('%Y-%m-%d %H:%M:%S'))
        #pd.strftime()
        #pd.to_datetime(pd.Series(df.Date))
        #df['Date'] = df.loc['Date'].dt.strftime('%Y-%m-%d %H:%M:%S')
        #df = df.to_dict()
        return  {'Dates':Dates,'SolarVoltage':SolarVoltage,'SolarCurrent':SolarCurrent,'BattVoltage':BattVoltage,'BattCurrent':BattCurrent,'LoadCurrent':LoadCurrent,'newDate':upDate}
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

            return {"Dates":datetime.now().replace(second=0, microsecond=0).strftime('%Y-%m-%d %H:%M:%S'),"SolarVoltage":1,"SolarCurrent": 2,"BattVoltage":3,"BattCurrent": 2,"LoadCurrent":3}

