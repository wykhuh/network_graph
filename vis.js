// https://bl.ocks.org/mbostock/2949937

var width = 1400,
    height = 900;

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

var force = d3.layout.force()
    .size([width, height]);

d3.csv("pp-links.csv", function(error, links) {
  if (error) throw error;

  d3.csv("pp-points.csv", function(error, rawNodes) {
    if (error) throw error;

    var nodesByName = {};

    // Create nodes for each unique source and target.
    links.forEach(function(link) {
      link.source = nodeByName(rawNodes, link.Source);
      link.target = nodeByName(rawNodes, link.Sink);
    });

    // Extract the array of nodes from the map by name.
    var nodes = d3.values(nodesByName);


    // Create the link lines.
    var link = svg.selectAll(".link")
        .data(links)
        .enter().append("line")
        .attr("class", "link");


    // Create the node circles.
    var node = svg.selectAll(".node")
        .data(nodes)
        .enter().append("circle")
        .attr("class", "node")
        .attr("r", function(d) {
          return 4.5
        })
        .call(force.drag);


    // Start the force layout.
    force
        .nodes(nodes)
        .links(links)
        .charge(-200)
        .linkDistance(150)
        .on("tick", tick)
        .start();


    var weightScale = d3.scaleLinear([1, 100], [4, 40]);


    function tick() {
      link.attr("x1", function(d) { return d.source.x; })
          .attr("y1", function(d) { return d.source.y; })
          .attr("x2", function(d) { return d.target.x; })
          .attr("y2", function(d) { return d.target.y; });

      node.attr("cx", function(d) { return d.x; })
          .attr("cy", function(d) { return d.y; })
          .attr('r', function(d) { return weightScale(d.weight); })
    }

    function nodeByName(rawNodes, name) {
      var node = rawNodes.find(n => n.name === name)

      return nodesByName[node.name] || (nodesByName[node.name] = {...node});
    }

  })

});
