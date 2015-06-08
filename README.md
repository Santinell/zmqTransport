[![Build Status](https://travis-ci.org/Santinell/zmqTransport.svg?branch=master)](https://travis-ci.org/Santinell/zmqTransport)

zmqTransport
=====

ZeroMQ transport for JRPC2

INSTALL
======
```
npm install zmq-transport
```


USING
=====

Server

```javascript
  var rpc = require('jrpc2');
  var zmqTransport = require('zmq-transport');

  var server = new rpc.Server();  

  server.loadModules(__dirname + '/modules/', function () {
    var zmq = new zmqTransport({url: 'tcp://127.0.0.1:5555'});
    zmq.listen(server);
  });
```

Client:

```javascript
  var rpc = require('jrpc2');
  var zmqTransport = require('zmq-transport');

  var zmq = new zmqTransport({url: 'tcp://127.0.0.1:5555'});

  var client = new rpc.Client(zmq);

  client.invoke('users.auth', ["admin","swd"], function (err, raw) {
    console.log(err, raw);
  });
```
