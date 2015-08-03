module.exports = function(RED) {

  var elasticsearch = require('elasticsearch');

  function Update(config) {
    RED.nodes.createNode(this,config);
    this.server = RED.nodes.getNode(config.server);
    var node = this;
    this.on('input', function(msg) {

      var client = new elasticsearch.Client({
          host: this.server.host
      });

      // check for overriding message properties
      if (msg.hasOwnProperty("documentId") && config.documentId === '') {
        config.documentId = msg.documentId;
      }
      if (msg.hasOwnProperty("documentIndex") && config.documentIndex === '') {
        config.documentIndex = msg.documentIndex;
      }
      if (msg.hasOwnProperty("documentType") && config.documentType === '') {
        config.documentType = msg.documentType;
      }

      var params = {
        index: config.documentIndex,
        type: config.documentType,
        id: config.documentId,
        body: {
          doc: msg.payload
        }
      }

      client.update(params).then(function (resp) {
        msg.payload = resp;
        node.send(msg);
      }, function (err) {
        node.error(err);
      });

    });
  }
  RED.nodes.registerType("update",Update);
}