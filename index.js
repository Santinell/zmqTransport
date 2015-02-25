var zmq = require('zmq');

module.exports = exports = (function zmqTransport () {
    function zmqTransport(params) {
        this.params = params;
        if (!this.params) {
            throw new Error('emptyParams');
        }
    }

    zmqTransport.prototype.send = function (body, callback) {
        var socket;
        socket = zmq.socket('req');
        socket.connect(this.params.url);
        socket.send(JSON.stringify(body));
        return socket.on('message', function (data) {
            return callback(null, data);
        });
    };

    zmqTransport.prototype.listen = function (server) {
        var socket;
        socket = zmq.socket('rep');
        return socket.bind(this.params.url, function (err) {
            return socket.on('message', function (data) {
                return server.handleRequest(data.toString(), {}, function (answer) {
                    return socket.send(JSON.stringify(answer));
                });
            });
        });
    };
    return zmqTransport;
})();
