
var socket = io()

var app = new Vue({
    el: '#app',
    data: {
        isConnected: false,
        socketMessage: ''
    },
    methods: {
        pingServer: function () {
            socket.emit('pingServer', 'PING!')
        }
    }
})


socket.on('connect', function () {
    app.isConnected = true
})


socket.on('disconnect', function () {
    app.isConnected = false
})

socket.on('pingResponse', function (msg) {
    app.socketMessage += msg.data
})

