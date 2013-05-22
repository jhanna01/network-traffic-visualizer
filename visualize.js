var width = 960,
	height = 500,
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
d3.json("visualization.json", function(json) {
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
		.style("stroke-width", function(d) { return (Math.sqrt(d.value) * 1.5 ); });

	var node = svg.selectAll(".node")
		.data(dataSet.nodes)
	  .enter().append("circle")
	  	.attr("class", "node")
	  	// Here we will change nodes radius
	  	.attr("r", 5)
	  	//.style("fill", function(d) { return color(d.group)})
	  	.call(force.drag);

	// Node mouse-over label
	node.append("title")
		.text(function(d) { return d.IP; });

	

}

