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

app.get('/visualize.js', function(req, res){
  fs.readFile('visualize.js', function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading');
    }
    res.writeHead(200, {'Content-Type': 'text/javascript'});
    res.end(data);
  });
});


app.get('/visualization.json', function(req, res) {

  var index = 0;
  var indexTable = [];

  // Returns list of all nodes
  db.query("START source = node(*) MATCH source-[r:PACKET_TO]->dest RETURN source.ipaddr, dest.ipaddr", function(err, results) {
    if (err) {
      console.log("e: " + err);
    }

    console.log(indexTable);
    /*indexTable['one'] = 1;
    indexTable['two'] = 2;*/
    // Put the IP addresses into the table, along with their index position as the key
    for (var k in results) {
      var result = results[k]['source.ipaddr'];
      if (-1 == indexTable.indexOf(result)) {
        indexTable.push(result);  
      }

      /**console.log(k);
      console.log(results[k]);
      console.log(results[k]['source.ipaddr']);*/
    }

    console.log(indexTable);

    for (var j in indexTable) {

    }


    res.writeHead(200, {'Content-Type': 'text/json'});
    res.end(JSON.stringify({nodes: indexTable}));

    //console.log(JSON.stringify(results));

  });


  // Returns links between nodes
  db.query("START source = node(*) MATCH source-[r:PACKET_TO]->dest RETURN source.ipaddr, dest.ipaddr", function(err, results) {
      if (err) {
        console.log("e: " + err);
      }
  });
  

  
});
app.listen(3010);
console.log('Listening on port 3000');
