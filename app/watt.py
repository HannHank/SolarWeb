import pandas as pd
from pymodbus.client.sync import ModbusSerialClient as ModbusClient
from datetime import * 
import json
import random
from dotenv import load_dotenv
import os

load_dotenv()
CsvPath = os.getenv("CSV")

def calcWatt():
    df = pd.read_csv(CsvPath)
    totalAmps = 0
    totalWatts = 0
    for index, row in df.iterrows():
       
       
        currentAmps = int((float(row[5])))
        currentVoltage = int(float(row[3]))
       # print("watt: ",currentVoltage*currentAmps)
        totalWatts += (( (currentAmps*currentVoltage) / 60 ) * 5) / 1000
        
    print("total: {}kw/h".format(totalWatts))

if __name__ == '__main__':
    calcWatt()