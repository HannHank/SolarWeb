import pandas as pd
from pymodbus.client.sync import ModbusSerialClient as ModbusClient
from datetime import * 
import json
import random
from dotenv import load_dotenv
import os

load_dotenv()
CsvPath = os.getenv("CSV")

class SolarStation():
    def __init__(self):
        print("init solar")
    def loadHistory(self,DateFrom, DateTo=datetime.now().replace(second=0, microsecond=0)):
        if(DateTo == ''):
            DateTo=datetime.now().replace(second=0, microsecond=0)
        df = pd.read_csv(CsvPath,parse_dates=[0])   
        # upDate = DateFrom
        # if updating == '1':
        #     upDate = datetime.strptime(DateFrom, "%Y-%m-%d %H:%M:%S")
        #     print("Date",upDate)
        #     upDate = upDate  + timedelta(minutes=6)
        #     print("Date after", upDate)
        #     upDate = upDate.strftime('%Y-%m-%d %H:%M:%S')
        
        df = df.query("Date >=  '" + str(DateFrom) + "' and Date <= '" + str(DateTo) + "'")
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

        return  {'Dates':Dates,'SolarVoltage':SolarVoltage,'SolarCurrent':SolarCurrent,'BattVoltage':BattVoltage,'BattCurrent':BattCurrent,'LoadCurrent':LoadCurrent}
    def loadLiveData(self,lastDate):
        # state = if we found new data in dataset
        print("lastDate: ",lastDate)
        DateTo =datetime.now().replace(second=0, microsecond=0)
        lastDate = datetime.strptime(lastDate,'%Y-%m-%d %H:%M:%S')
        df = pd.read_csv(CsvPath,parse_dates=[0])   
        df = df.query("Date >  '" + str(lastDate) +  "' and Date < '" + str(DateTo) + "'")

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
        if len(Dates) == 0:
            state = False
        else:
            state = True    
        return  {'Dates':Dates,'SolarVoltage':SolarVoltage,'SolarCurrent':SolarCurrent,'BattVoltage':BattVoltage,'BattCurrent':BattCurrent,'LoadCurrent':LoadCurrent,'newDate':state}
        # state = True 
        # df = pd.read_csv(CsvPath,parse_dates=[0])  
        # p = len(df.Date) -1
        # lastDate = datetime.strptime(lastDate,'%Y-%m-%d %H:%M:%S')
        # csvLastEntryDate = df.Date[p]
        # if lastDate >= csvLastEntryDate:
        #     state = False
        # Dates = df.Date[p].strftime('%Y-%m-%d %H:%M:%S')
        # SolarVoltage = df.SolarVoltage[p]
        # SolarCurrent = df.SolarCurrent[p]
        # BattVoltage = df.BattVoltage[p]
        # BattCurrent = df.BattCurrent[p]
        # LoadCurrent = df.LoadCurrent[p]

        # return  {'Dates':Dates,'SolarVoltage':SolarVoltage,'SolarCurrent':SolarCurrent,'BattVoltage':BattVoltage,'BattCurrent':BattCurrent,'LoadCurrent':LoadCurrent,'newData':state}
