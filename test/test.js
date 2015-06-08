var should = require("chai").should();
var rpc = require("jrpc2");
var zmqTransport = require("../");
var server = null;
var zmq = null;
var zmqClient = null;

describe("Server", function () {

  it("should have context", function () {
    server = new rpc.Server();
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
    server.should.have.property("modules");
    server.modules.methods.should.have.property("sum");
    server.modules.methods["sum"].should.be.an["instanceof"](Function);
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
      new rpc.Client();
    }).should.throw(Error);
  });

  it("should have transport and id", function () {
    zmqClient = new rpc.Client(zmq);
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
    zmqClient.invoke("sum", [22, 33], callback);
  });
});
