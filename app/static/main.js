var socket = io()

// get old day and set as default date
var d = new Date()
d.setDate(d.getDate() - 1);
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
                    }

                ]
            }, { responsive: true, maintainAspectRatio: false });
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
        chartData: [3, 2, 3],
        dataChart: {},

    },
    methods: {
        pingServer: function() {
            socket.emit('pingServer', 'PING!')
        },
        loadData: function() {
            socket.emit('loadData', {
                'DateFrom': this.DateFrom,
                'DateTo': this.DateTo
            })
        },
        loadLiveData: function() {
            socket.emit('liveData')
        },

        getRandomInt() {
            return Math.floor(Math.random() * (50 - 5 + 1)) + 5
        }


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
    app.data = msg
    app.dataChart = msg



})

socket.on('loadedLiveData', function(msg) {
    console.log(msg.data)
    if (msg.data == false) {
        app.errMsg = msg.errMsg
    } else {
        app.data.push(msg.data);
        app.errMsg = ''

    }
})