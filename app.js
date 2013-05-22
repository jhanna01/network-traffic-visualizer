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
  db.query("START n = node(*) RETURN n.ipaddr AS IP", function(err, results) {
    if (err) {
      console.log("e: " + err);
    }

    var result;
    // Put the IP addresses into the array
    for (var k in results) {

      result = results[k]['IP'];
      //console.log(result);
      //nodes.push(result);  
      nodes[result] = k;
    }

    //test[result] = true;
    //console.log(nodes[result]);
    // console.log(nodes);
    //console.log(result);
    
    
    

    res.writeHead(200, {'Content-Type': 'text/json'});
    res.end(JSON.stringify({nodes: nodes}));

    console.log(JSON.stringify(results));

  });

  // Returns links between nodes
  db.query("START source = node(*) MATCH source-[r:PACKET_TO]->dest RETURN source.ipaddr, dest.ipaddr, r.length", function(err, results) {

      if (err) {
        console.log("e: " + err);
      }

    // Put the connect links (edges) into the array 
    for (var k in results) {
      var source = results[k]['source.ipaddr'];
      var target = results[k]['dest.ipaddr'];
      var length = results[k]['r.length'];
      links.push({source: nodes[source], target: nodes[target], size: length});  
      //console.log({source: nodes.indexOf(source), target: nodes.indexOf(target)});
    }

    console.log(JSON.stringify({links: links}));
    //console.log(links);

  });
  

  
});
app.listen(3010);
console.log('Listening on port 3010');
