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

  console.log(links)

  d3.csv("pp-points.csv", function(error, rawNodes) {
    if (error) throw error;

    var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

    var nodesByName = {};

    // Create nodes for each unique source and target.
    links.forEach(function(link) {
      link.source = nodeByName(rawNodes, link.source);
      link.target = nodeByName(rawNodes, link.target);
    });

    // Extract the array of nodes from the map by name.
    var nodes = d3.values(nodesByName);
    var weightScale = d3.scaleLinear([1, 100], [4, 32]);


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

        node.on("mouseover", function(d) {
          d3.select(this).transition()
          .duration(100)
          .style('stroke', '#FF0000')
          .attr("stroke-width", 3)


          tooltip.transition()
          .duration(200)
          .style('opacity', 1);

          let related = links.filter(link => {
            return link.source.name == d.name
          })
          .map(link => {
            return link.target.name
          })

          let content = '<div class="tooltip">'
          content += '<p>' + d.name + '</p>';
          content += '<p>' + related.length + ' connections</p>'
          content += related.join(', ')
          content += '</div>'

          tooltip.html(content)
              .style("left", "10px")
              .style("top", "10px");
        })
        .on('mouseout', function(d) {
          d3.select(this).transition()
          .duration(100)
          .style('stroke', '#fff')
          .attr("stroke-width", 1)

          tooltip.transition()
          .duration(500)
          .style("opacity", 0);
        })


    // Start the force layout.
    force
        .nodes(nodes)
        .links(links)
        .charge(-200)
        .linkDistance(250)
        .on("tick", tick)
        .start();




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
