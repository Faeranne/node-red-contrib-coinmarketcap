var request = require('superagent');
module.exports = function(RED){
  function getCoin(config){
    RED.nodes.createNode(this,config);
    var node = this;
    node.on('input',function(msg){
      var type=msg.payload;
      request
      .get('https://api.coinmarketcap.com/v1/ticker/'+type+'/')
      .end(function(err,res){
        if(err){
          node.error(err)
          return;
        }
        var body = res.body;
        if(typeof body == "object"){
          if(body.error){
            if(body.error=="id not found"){
              node.log("Bad id value.  "+type+" isn't an available coin type.",msg);
            }else{
              node.error(body.error);
            }
          }else{
            var newMsg = {}; 
            newMsg.payload=body[0];
            node.send(newMsg);
          }
        }else{
          node.error(body);
        }
      })
    })
  }
  function getAllCoin(config){
    RED.nodes.createNode(this,config);
    var node = this;
    node.on('input',function(msg){
      let query = {};
      if(msg.limit){
        query.limit=msg.limit;
      };
      request
      .get('https://api.coinmarketcap.com/v1/ticker/')
      .query(query)
      .end(function(err,res){
        if(err){
          node.error(err)
          return;
        }
        var body = res.body;
        if(typeof body == "object"){
          if(body.error){
            node.error(body.error);
          }else{
            var newMsg = {}; 
            newMsg.payload=body;
            node.send(newMsg);
          }
        }else{
          node.error(body);
        }
      })
    })
  }
  RED.nodes.registerType("get-coin",getCoin);
  RED.nodes.registerType("get-all-coin",getAllCoin);
}

