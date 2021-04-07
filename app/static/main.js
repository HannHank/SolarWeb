var socket = io()

// get old day and set as default date
var d = new Date() // getHours(
    // d.setDate(d.getDate() - 1);
d.setHours(d.getHours() - 5);
d = d.toISOString().replace(/T/, ' ').replace(/\..+/, '')
Vue.component("line-chart", {
    extends: VueChartJs.Line,
    props: ["data", "options", "updateTrigger", "updateTriggerReload"],

    mounted() {
        this.renderLineChart();
    },
    computed: {
        dataChart: function() {
            return this.data;
        },
        update: function() {
            return this.updateTrigger
        },
        reload: function() {
            return this.updateTriggerReload
        },
    },
    methods: {

        renderLineChart: function() {
            this.renderChart({
                labels: this.dataChart['Dates'],
                datasets: [{
                        label: "SolarVoltage",
                        //borderColor: "#0000ff",
                        //backgroundColor: "#f87979",
                        backgroundColor: "rgba(255, 10, 13, 0.2)",
                        borderColor: "rgba(255, 10, 13, 0.6)",
                        //fillOpacity: 0.8,
                        data: this.dataChart['SolarVoltage']
                    },
                    {
                        label: "SolarCurrent",
                        backgroundColor: "rgba(50, 168, 82, 0.2)",
                        borderColor: "rgba(50, 168, 82, 0.6)",
                        data: this.dataChart['SolarCurrent']
                    },
                    {
                        label: "BattVoltage",
                        backgroundColor: "rgba(142, 50, 168, 0.2)",
                        borderColor: "rgba(142, 50, 168, 0.6)",
                        data: this.dataChart['BattVoltage']
                    },
                    {
                        label: "BattCurrent",
                        backgroundColor: "rgba(168, 50, 107, 0.2)",
                        borderColor: "rgba(168, 50, 107, 0.6)",
                        data: this.dataChart['BattCurrent']
                    },
                    {
                        label: "LoadCurrent",
                        backgroundColor: "rgba(50, 168, 158, 0.2)",
                        borderColor: "rgba(50, 168, 158, 0.6)",
                        data: this.dataChart['LoadCurrent']
                    },
                ]
            }, {

                legend: {
                    position: 'top',
                    labels: {
                        fontColor: '#FFFFFF',
                    },
                },
                hover: {
                    mode: 'nearest'
                },
                responsive: true,
                // aspectRatio: 4,
                maintainAspectRatio: false,
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
        update: function() {
            // this._chart.destroy();
            //this.renderChart(this.data, this.options);
            this._data._chart.update();
            //this.renderLineChart();
        },
        reload: function() {
            this._data._chart.destroy();
            this.renderLineChart();
        }
    },

});

var app = new Vue({

    el: '#app',
    data: {
        isConnected: false,
        updateTrigger: false,
        updateTriggerReload: false,
        socketMessage: '',
        data: [],
        errMsg: '',
        DateFrom: d, //'2021-04-03 06:34:00',
        DateTo: '',
        dataChart: {
            'Dates': [1],
            'SolarVoltage': [2],
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
            console.log((this.dataChart['Dates'].length - 1))
            socket.emit('liveData', {
                'lastDate': this.dataChart['Dates'][(this.dataChart['Dates'].length - 1)]
            })

        },

        getRandomInt() {
            return Math.floor(Math.random() * (50 - 5 + 1)) + 5
        },


    },
    async mounted() {
        this.loadData()
        setInterval(async() => {
            this.loadLiveData()
        }, 360000);
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
    //§ app.data = msg
    // app.DateFrom = msg['newDate']
    app.dataChart = msg
    app.updateTriggerReload = !app.updateTriggerReload
})

socket.on('loadedLiveData', function(msg) {
    //check if data is new
    console.log(msg.data['newData'])
    console.log("data befor", msg.data)
    if (msg.data['newData'] == true) {
        len = Object.keys(app.dataChart).length - 1
        for (i = 0; i < len; i++) {
            console.log("hello")
            console.log((app.dataChart[Object.keys(app.dataChart)[i]].length))
                //remove first entry 
            if (app.dataChart[Object.keys(app.dataChart)[i]].length >= 1) {
                app.dataChart[Object.keys(app.dataChart)[i]].shift()
            }
            // add new data
            app.dataChart[Object.keys(app.dataChart)[i]].push(msg.data[Object.keys(app.dataChart)[i]])
        }
        console.log("data after: ", app.dataChart)
        app.updateTrigger = !app.updateTrigger
        app.errMsg = ''
            // }
    } else {
        console.log("logger script might be down or SolarStation is disconnected")
        app.errMsg = 'SolarStation/logger is down!'
    }
})