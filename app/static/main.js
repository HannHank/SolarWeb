var socket = io()
    // get old day and set as default date
var d = new Date()
d.setDate(d.getDate() - 1);
d = d.toISOString().replace(/T/, ' ').replace(/\..+/, '')

var app = new Vue({
    el: '#app',
    data: {
        isConnected: false,
        socketMessage: '',
        data: [],
        errMsg: '',
        DateFrom: d, //'2021-04-03 06:34:00',
        DateTo: ''
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
    app.data = msg.data


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