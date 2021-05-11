from dotenv import load_dotenv
import os
load_dotenv()
from datetime import * 
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
from sklearn import linear_model

def predictBVoltage(entries:int, Voltage:int):
    CsvPath = os.getenv("CSV")
    df = pd.read_csv(CsvPath,parse_dates=[0])
    df = df.iloc[(entries * -1):] 
    Voltage = np.asarray([Voltage])
    df = pd.DataFrame({'time': df['Date'], 'count': df['BattVoltage']})
    df.time = pd.to_datetime(df.time)

    dt = df['time'].astype(np.int64)
    df.time = dt
    regr = linear_model.LinearRegression()
    regr.fit(df['count'].values.reshape(-1, 1),df.time.values.reshape(-1, 1) )

    # Make predictions using the testing set
    y_pred = regr.predict(df['count'].values.reshape(-1, 1))
    df['pred'] = y_pred

    ax = df.plot(x='count', y='time', color='black', style='.')
    df.plot(x='count', y='pred', color='orange', linewidth=3, ax=ax, alpha=0.5)
    ax.set_title('My Title')
    ax.set_xlabel('Date')
    ax.set_ylabel('Metric')
    data = regr.predict(Voltage.reshape(-1,1))
    for date in data:
        #there is only one entry, could be cleaned up
        date = date.astype(int)
        date = date[0]
        date = date / 1000000000
        date = datetime.fromtimestamp(date).strftime('%Y-%m-%d %H:%M:%S')
    #plt.show()
    return {'Date':date,'score':round(regr.score(df['count'].values.reshape(-1, 1),df.time.values.reshape(-1, 1)),2)}
