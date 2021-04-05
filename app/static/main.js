var socket = io()

// get old day and set as default date
var d = new Date() // getHours(
    // d.setDate(d.getDate() - 1);
d.setHours(d.getHours() - 5);
d = d.toISOString().replace(/T/, ' ').replace(/\..+/, '')
Vue.component("line-chart", {
    extends: VueChartJs.Line,
    props: ["data", "options"],
    mounted() {
        this.renderLineChart();
    },
    computed: {
        chartData: function() {
            return this.data;
        }
    },
    methods: {
        renderLineChart: function() {
            this.renderChart({
                labels: this.chartData['Dates'],
                datasets: [{
                        label: "SolarVoltage",
                        //borderColor: "#0000ff",
                        //backgroundColor: "#f87979",
                        backgroundColor: "rgba(255, 10, 13, 0.2)",
                        borderColor: "rgba(255, 10, 13, 0.6)",
                        //fillOpacity: 0.8,
                        data: this.chartData['SolarVoltage']
                    },
                    {
                        label: "SolarCurrent",
                        backgroundColor: "rgba(50, 168, 82, 0.2)",
                        borderColor: "rgba(50, 168, 82, 0.6)",
                        data: this.chartData['SolarCurrent']
                    },
                    {
                        label: "BattVoltage",
                        backgroundColor: "rgba(142, 50, 168, 0.2)",
                        borderColor: "rgba(142, 50, 168, 0.6)",
                        data: this.chartData['BattVoltage']
                    },
                    {
                        label: "BattCurrent",
                        backgroundColor: "rgba(168, 50, 107, 0.2)",
                        borderColor: "rgba(168, 50, 107, 0.6)",
                        data: this.chartData['BattCurrent']
                    },
                    {
                        label: "LoadCurrent",
                        backgroundColor: "rgba(50, 168, 158, 0.2)",
                        borderColor: "rgba(50, 168, 158, 0.6)",
                        data: this.chartData['LoadCurrent']
                    },
                ]
            }, {
                responsive: true,
                // aspectRatio: 4,
                maintainAspectRatio: false,
                legend: {
                    labels: {

                        fontColor: '#FFFFFF',
                    }
                },
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true,
                            fontColor: '#F4A261',
                        }
                    }],
                    xAxes: [{
                        ticks: {
                            beginAtZero: true,
                            fontColor: '#F4A261',
                        }
                    }]
                }
            }, );
        }
    },
    watch: {
        data: function() {
            this._chart.destroy();
            //this.renderChart(this.data, this.options);
            this.renderLineChart();
        }
    }
});

var app = new Vue({

    el: '#app',
    data: {
        isConnected: false,
        socketMessage: '',
        data: [],
        errMsg: '',
        DateFrom: d, //'2021-04-03 06:34:00',
        DateTo: '',
        datacollection: null,
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        lol: [1, 3, 5, 6],
        liveData: {
            'Dates': 0,
            'SolarVoltage': 0,
            'SolarCurrent': 0,
            'BattVoltage': 0,
            'BattCurrent': 0,
            'LoadCurrent': 0
        },
        dataChart: {
            'Dates': [],
            'SolarVoltage': [],
            'SolarCurrent': [],
            'BattVoltage': [],
            'BattCurrent': [],
            'LoadCurrent': []
        },
    },
    methods: {
        pingServer: function() {
            socket.emit('pingServer', 'PING!')
        },
        loadData: function() {
            socket.emit('loadData', {
                'DateFrom': this.DateFrom,
                'DateTo': this.DateTo,
                'updating': '0'
            })
        },
        loadLiveData: function() {

            socket.emit('loadData', {
                    'DateFrom': this.DateFrom,
                    'DateTo': this.DateTo,
                    'updating': '1'
                })
                //socket.emit('liveData')
                //   console.log("live data:", this.dataChart)

        },

        getRandomInt() {
            return Math.floor(Math.random() * (50 - 5 + 1)) + 5
        },


    },
    async mounted() {
        //this.loadData()
        setInterval(async() => {
            this.getLiveData()
            socket.emit('liveData')
                // console.log("dataset: ",this.labels,this.data);
        }, 3600000);
    }

})


socket.on('connect', function() {
    app.isConnected = true
})


socket.on('disconnect', function() {
    app.isConnected = false
})

socket.on('pingResponse', function(msg) {
    app.socketMessage += msg.data
});
socket.on('loadedData', function(msg) {
    console.log("data: " + msg)
        //§ app.data = msg
    console.log(msg)
    app.DateFrom = msg['newDate']
    app.dataChart = msg




})

socket.on('loadedLiveData', function(msg) {

    // if (msg.data == false) {
    //     app.errMsg = msg.errMsg
    // } else {



    // constructor['SolarVoltage'].push(msg.data['SolarVoltage'])
    // constructor['SolarCurrent'].push(msg.data['SolarCurrent'])
    // constructor['BattVoltage'].push(msg.data['BattVoltage'])
    // constructor['BattCurrent'].push(msg.data['BattCurrent'])
    // constructor['LoadCurrent'].push(msg.data['LoadCurrent'])
    for (i = 0; i < 5; i++) {
        liveData[Object.keys(liveData)[i]] = Object.keys(msg.data)[i]
    }
    console.log("liveData", liveData)
    c = app.dataChart
    newPosition = c['Dates'].length + 1
    c['Dates'][newPosition] = msg.data['Dates']
    c['SolarVoltage'][newPosition] = msg.data['SolarVoltage']
    c['SolarCurrent'][newPosition] = msg.data['SolarCurrent']
    c['BattVoltage'][newPosition] = msg.data['BattVoltage']
    c['BattCurrent'][newPosition] = msg.data['BattCurrent']
    c['LoadCurrent'][newPosition] = msg.data['LoadCurrent']
    app.dataChart = {
        'Dates': c['Dates'],
        'SolarVoltage': c['SolarVoltage'],
        'SolarCurrent': c['SolarCurrent'],
        'BattVoltage': c['BattVoltage'],
        'BattCurrent': c['BattCurrent'],
        'LoadCurrent': c['LoadCurrent']

    }
    app.errMsg = ''
    console.log(app.dataChart)
        // }
})