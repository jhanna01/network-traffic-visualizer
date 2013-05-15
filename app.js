var express = require('express');
var app     = express();
var fs      = require('fs');
var neo4j   = require('neo4j');

var db = new neo4j.GraphDatabase('http://localhost:7474');

app.get('/index.html', function(req, res){
  fs.readFile('index.html', function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading');
    }
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end(data);
  });
});


app.get('/visualization.json', function(req, res) {

  // Returns list of all nodes
  db.query("START n = node(*) RETURN n.ipaddr", function(err, results) {
    if (err) {
      console.log("e: " + err);
    }

    // // transform the JSON
    // var nodes = []; // list of all the systems
    // var links = []; // nodes[i] -> nodes[j]

    // var i = 0;
    // for (key in results) {
    //   nodes[i] = { ip: results[key].ipaddr };
    // }

  // FIXME: NEED TO FIX ASYNC ISSUE HERE
  // Returns links between nodes
  db.query("START source = node(*) MATCH source-[r:PACKET_TO]->dest RETURN source.ipaddr, dest.ipaddr", function(err, results) {
    if (err) {
      console.log("e: " + err);
    }



    // var i = 0;
    // for (key in results) {
    //   links[i] = { source: };
    // }

    // for (key in results) {

    // }

    res.writeHead(200, {'Content-Type': 'text/json'});
    res.end(JSON.stringify(results));

    console.log(JSON.stringify(results));
  });
  
});
app.listen(3000);
console.log('Listening on port 3000');
