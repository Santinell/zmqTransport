zmqTransport
=====

ZeroMQ transport for JRPC2

INSTALL
======
```
npm install zmqTransport
```


USING
=====

Server

```javascript
  var rpc = require('jrpc2');
  var zmqTransport = require('zmqTransport');

  var server = new rpc.server;  

  server.loadModules(__dirname + '/modules/', function () {
    var zmq = new zmqTransport({url: 'tcp://127.0.0.1:5555'});
    zmq.listen(server);
  });
```

Client:

```javascript
  var rpc = require('jrpc2');
  var zmqTransport = require('zmqTransport');

  var zmq = new zmqTransport({url: 'tcp://127.0.0.1:5555'});

  var client = new rpc.client(zmq);

  client.call('users.auth', ["admin","swd"], function (err, raw) {
    console.log(err, raw);
  });
```