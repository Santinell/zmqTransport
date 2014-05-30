var should = require("chai").should();
var rpc = require("jrpc2");
var zmqTransport = require("../");
var server = null;
var zmq = null;
var zmqClient = null;

describe("Server", function () {

  it("should have context", function () {
    server = new rpc.server();
    server.should.have.property("context");
  });

  it("should correct load modules from directory", function () {
    server.loadModules(__dirname + "/modules/", function () {
      server.methods.should.have.property("users.auth");
      server.methods.should.have.property("logs.userLogout");
      server.methods["users.auth"].should.be.an["instanceof"](Function);
    });
  });

  it("should have success function expose", function () {
    server.expose("sum", function (a, b) {
      return a + b;
    });
    server.should.have.property("methods");
    server.methods.should.have.property("sum");
    server.methods["sum"].should.be.an["instanceof"](Function);
  });

  it("should have sucess expose function with promise", function () {
    server.expose("reverse", function (num) {
      return Q.delay(500).then(function () {
        return num*-1;
      });
    });
    server.should.have.property("methods");
    server.methods.should.have.property("reverse");
    server.methods["reverse"].execute(server, [13]).should.have.property("then");
    server.methods["reverse"].should.be.an["instanceof"](Function);
  });

  it("should have success module expose", function () {
    server.exposeModule("math", {
      log: function (num, base) {
        return Math.log(num) / Math.log(base);
      }
    });
    server.should.have.property("methods");
    server.methods.should.have.property("math.log");
    server.methods["math.log"].should.be.an["instanceof"](Function);
  });

  it("should correct work with context", function () {
    server.expose("getName", function () {
      return this.name;
    });
    var context = {name: "Ted"};
    server.methods["getName"].execute(context, []).should.equal("Ted");
  });

  it("should expose notification", function () {
    server.expose("console", function (message) {
      console.log("    >>" + message);
    });
    server.methods.should.have.property("console");
    should.equal(server.methods["console"]("Hello server"), undefined);
  });
});


describe("zmqTransport", function () {

  it("should throw error because of no params", function () {
    (function () {
      new rpc.zmqTransport();
    }).should.throw(Error);
  });

  it("should correct save params", function () {
    zmq = new zmqTransport({});
    zmq.should.have.property("params");
  });

  it("should throw error because of no url", function () {
    zmq.listen.should.throw(Error);
  });

  it("should throw error because of no server", function () {
    zmq.params.url = 'tcp://127.0.0.1:5555';
    zmq.params.should.deep.equal({url: 'tcp://127.0.0.1:5555'});
    zmq.listen.should.throw(Error);
  });

  it("should success listen server", function () {
    (function () {
      zmq.listen(server);
    }).should.not.throw(Error);
  });
});



describe("zmqClient", function () {

  it("should throw error because of no transport", function () {
    (function () {
      new rpc.client;
    }).should.throw(Error);
  });

  it("should have transport and id", function () {
    zmqClient = new rpc.client(zmq);
    zmqClient.should.have.property("transport");
    zmqClient.should.have.property("id");
    zmqClient.id.should.equal(0);
    zmqClient.transport.should.not.equal(null);
  });

  it("should correct call methods", function (done) {
    var callback = function(err, raw){
      should.not.exist(err);
      var obj = JSON.parse(raw);
      obj.should.deep.equal({id: 1, jsonrpc: '2.0', result: 55});
      done();
    };
    zmqClient.call("sum", [22, 33], callback);
  });
});