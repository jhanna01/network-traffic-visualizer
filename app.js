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
  var nodes = [];
  var links = [];
  var test  = [];

  // Returns list of all nodes
  db.query("START n = node(*) RETURN n.ipaddr", function(err, results) {
    if (err) {
      console.log("e: " + err);
    }

    var result;
    // Put the IP addresses into the array
    for (var k in results) {
      result = results[k]['n.ipaddr'];
      nodes.push(result);  
    }
    test[result] = true;

    console.log(test);

    console.log(nodes);

    res.writeHead(200, {'Content-Type': 'text/json'});
    res.end(JSON.stringify({nodes: nodes}));

    //console.log(JSON.stringify(results));

  });

  // Returns links between nodes
  db.query("START source = node(*) MATCH source-[r:PACKET_TO]->dest RETURN source.ipaddr, dest.ipaddr", function(err, results) {

      if (err) {
        console.log("e: " + err);
      }

    // Put the connect links (edges) into the array 
    for (var k in results) {
      var source = results[k]['source.ipaddr'];
      var target = results[k]['dest.ipaddr']
      links.push({source: nodes.indexOf(source), target: nodes.indexOf(target)});  
      console.log({source: nodes.indexOf(source), target: nodes.indexOf(target)});
    }

    console.log(JSON.stringify({links: links}));

  });
  

  
});
app.listen(3010);
console.log('Listening on port 3000');
