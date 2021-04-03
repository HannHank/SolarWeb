var socket = io()

var app = new Vue({
    el: '#app',
    data: {
        isConnected: false,
        socketMessage: '',
        data: {}
    },
    methods: {
        pingServer: function() {
            socket.emit('pingServer', 'PING!')
        },
        loadData: function() {
            console.log("load data")
            socket.emit('loadData', { 'Date': 12 })
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
    console.log("got response " + msg.data)
    app.data = msg
    console.log(app.data)
})