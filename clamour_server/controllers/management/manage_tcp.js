var net = require("net");
var colors = require("colors");

// TCP server creation
var server = net.createServer();

exports.listen_to_data_stream = function (req, res, next) {
    server.listen(3001, '127.0.0.1', function () {
        console.log(`TCP server listening to ${server.address().address}:${server.address().port}`.blue);
    }).on("connection", handleTcpConnection);
}

function handleTcpConnection(socket) {
    var remoteAddress = socket.remoteAddress + ':' + socket.remotePort;
    console.log("TCP new client connection from %s".green, remoteAddress);

    // socket.on  ("ready",    onReady);  
    // socket.on  ("timeout",  onTimeOut);
    socket.on  ("data",     onEventData);
    socket.once("close",    onEventClose);
    socket.on  ("error",    onEventError);

    function onEventData(data) {
        console.log(`TCP connection data from ${remoteAddress}: ${data.toString("ascii")}`.cyan);
    }

    function onEventClose() {
        console.log(`TCP connection from ${remoteAddress} closed`.yellow);
    }

    function onEventError(err) {
        console.log(`TCP connection ${remoteAddress} error: ${err.message}`.red);
    }
}