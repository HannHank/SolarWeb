var socket = io()

// get old day and set as default date
var d = new Date()
d.setDate(d.getDate() - 1);
d = d.toISOString().replace(/T/, ' ').replace(/\..+/, '')

Vue.component('line-chart', {
    props: ['postTitle', 'solarData'],
    extends: VueChartJs.Line,
    mounted() {
        console.log(this.solarData);
        this.renderChart({
            labels: this.solarData['Date'],
            datasets: [{
                    label: 'SolarStation',
                    backgroundColor: '#f87979',
                    data: this.solarData['SolarCurrent']
                },
                // {
                //     label: 'Lol',
                //     backgroundColor: '#f0009',
                //     data: [2, 2, 1, 2, 3, 4, 5]
                // },


            ]
        }, { responsive: true, maintainAspectRatio: false })
    }

})


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

    },
    methods: {
        pingServer: function() {
            socket.emit('pingServer', 'PING!')
        },
        loadData: function() {
            console.log("load data")
            socket.emit('loadData', {
                'DateFrom': this.DateFrom,
                'DateTo': this.DateTo
            })
        },
        loadLiveData: function() {
            socket.emit('liveData')
        },
        fillData() {
            this.datacollection = {
                labels: [this.getRandomInt(), this.getRandomInt()],
                datasets: [{
                    label: 'Data One',
                    backgroundColor: '#f87979',
                    data: [this.getRandomInt(), this.getRandomInt()]
                }, {
                    label: 'Data One',
                    backgroundColor: '#f87979',
                    data: [this.getRandomInt(), this.getRandomInt()]
                }]
            }
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
})
socket.on('loadedData', function(msg) {
    console.log("data: " + msg)
    app.data = msg


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