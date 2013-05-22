var width = 1100,
	height = 600,
	dataSet = {};

var color = d3.scale.category20();

// Gives it the physics of the force directed layout
var force = d3.layout.force()
	.charge(-120)
	.linkDistance(30)
	.size([width, height]);

// Sets up the SVG that will act as our canvas
var svg = d3.select("#chart").append("svg")
	.attr("width", width)
	.attr("height", height);

// Use the json file for the graph data
d3.json("visualization.json", function(error, json) {
	console.log("e: " + error);
    dataSet = json;
    visualizeIt();
    return 0;
});


function visualizeIt() {
	force
		.nodes(dataSet.nodes)
		.links(dataSet.links)
		.start();

	var link = svg.selectAll(".link")
		.data(dataSet.links)
	  .enter().append("line")
		.attr("class", "link")
		.style("stroke-width", function(d, i) { return (Math.sqrt(d.size)); })
		.style("stroke", "#999")
		.style("stroke-opacity", .7)
		.attr("marker-end", "url(#end)");


	var node = svg.selectAll(".node")
		.data(dataSet.nodes)
	  .enter().append("circle")
	  	.attr("class", "node")
	  	// Here we will change nodes radius
	  	.attr("r", 10)
	  	//.style("fill", function(d) { return color(d.group)})
	  	.style("stroke-width", 1.5);
	  	.call(force.drag);

	// Node mouse-over label
	node.append("title")
		.text(function(d) { return d.IP; });

	force.on("tick", function() {
     link.attr("x1", function(d, i) { return d.source.x; })
        .attr("y1", function(d, i) { return d.source.y; })
        .attr("x2", function(d, i) { return d.target.x; })
        .attr("y2", function(d, i) { return d.target.y; });

    node.attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });
  	});

}

