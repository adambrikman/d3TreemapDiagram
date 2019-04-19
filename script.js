// Set URL of Video Game Sales data to the variable dataset
const dataset = "https://cdn.rawgit.com/freeCodeCamp/testable-projects-fcc/a80ce8f9/src/data/tree_map/video-game-sales-data.json";

// Set constants of SVG width and height 
const h = 820;
const w = 1000;

// Set constants of treemap width and height 
const treemap_H = 600;
const treemap_W = 950;

// create an SVG element
const svg = d3.select("body")
      .append("svg")
      .attr("height", h)
      .attr("width", w)

// Initialize consoleNames array to hold all consoles for legend
let consoleNames = [];

// Initialize a variable to align the rects & text for the lengend
let incrementY = 0;
let incrementTextY = 0;

// Create a scale of 20 colors. Originally found as a result of the following post: https://stackoverflow.com/questions/34163662/is-there-a-way-to-generate-more-than-20-colors-in-d3
color = d3.scaleOrdinal(d3.schemeCategory20);

// Create div for tooltip
var tooltip = d3.selectAll("body")
    .append("div")
    .attr("id","tooltip")
    .style("opacity", 0);


// Function utilize the JSON dataset
d3.json(dataset, function(error, data) {
  if (error) throw error;

// Set the hierarchy of data to the variable root. Documentation: https://github.com/d3/d3-hierarchy#hierarchy
var root = d3.hierarchy(data);

// Node sum called before invoking our hierarchial layout (d3.treemap() below). Documentation: https://github.com/d3/d3-hierarchy#node_sum
root.sum(function(d) {
  return d.value;
});

// Sort the children of each node. Documentation: https://github.com/d3/d3-hierarchy#node_sort
root
.sort(function(a, b) { return b.value - a.value; })
  
// Note: The code below was refactored based on the treemap found here: https://bl.ocks.org/d3indepth/96649ce5ef72d53386790908fe785a6a

// Set our hierarchial layout (and it's respective width and height )to the variable treemapLayout
var treemapLayout = d3.treemap()
  .size([treemap_W, treemap_H])

// Loop through our data and push all names of the consoles to our consoleNames array
for(let i = 0; i < data.children.length; i++) {
  consoleNames.push(data.children[i].name);
}
  
// Invoke our hierarchial layout, passing in the hierarchy of our data.  
treemapLayout(root);

// Pass in the data from our lowest nodes (with and without children), to all 'g' elements within our SVG.
var nodes = d3.select('svg')
  .selectAll('g')
  // root.leaves section of the D3 Hierarchy documentation: https://github.com/d3/d3-hierarchy/ || originally noted as a result of raphaeluziel at the following post: https://www.freecodecamp.org/forum/t/treemap-test-5-6/227929/4. The below line is used to access the nodes without children.
  .data(root.leaves())
  .enter()
  .append('g')
  .attr('transform', function(d) {return 'translate(' + [d.x0, d.y0] + ')'})

  // Format our rects within the treemap
  nodes
    .append('rect')
    .attr("class", "tile")
    .style("stroke", "white")
    .attr("data-name", (d) =>  d.data.name)
    .attr("data-category", (d) => d.data.category)
    .attr("data-value", (d) => d.value)
    .attr('width', function(d) { return d.x1 - d.x0; })
    .attr('height', function(d) { return d.y1 - d.y0; })
    .style("fill", (d) => color(d.data.category))

     // Create tooltip for treemap rects
    .on("mouseover", function(d) {
        tooltip.style("opacity", .9)
          .style("z-index", 10)
          .style("border-radius", 5 + "px")
          .style("position", "absolute")
          .style("font-size", "14px")
          .style("left", (d3.event.pageX+40) + "px")
          .style("top", (d3.event.pageY-50) + "px")
          .style("box-shadow", "1px 1px 10px")
          .style("color", "white")
          .style("background", "black")
          .style("padding", "10px")
          .style("text-align", "left")
          .style("pointer-events", "none")
          .html("Name: " + d.data.name + "<br/>" +
                "Category: " + d.data.category + "<br/>" +
                "Value: " + d.value)
          .attr("data-value", d.value)
      })
  
      .on("mousemove", function (d) {
        tooltip.style("left", (d3.event.pageX+40) + "px")
        tooltip.style("top", (d3.event.pageY-50) + "px")
      })

      .on("mouseout", function(d) {		
        tooltip.style("opacity", 0);	
      });
 
  // Create text to be included in our treemap rects
  nodes
    .append('text')
    .attr("id", "tileText")
    .attr('dx',5)
    .attr('dy',18)
    .style("font-size", 12 + "px")
    .style("fill", "white")
    .style("stroke-width", .2+"px")
    .text(function(d) {
      return d.data.name;
  });

/* Create Legend */

/* NOTE: Code below was refactored based on user jkeohan's D3 Legend Examples posted here: https://bl.ocks.org/jkeohan/b8a3a9510036e40d3a4e */
  
        // Create g element for legend
        var g = d3.select("g")
        .append("g")
        .attr("id", "legend");  
            
        // D3 Vertical Legend//
        var legend = g.selectAll('g')
            .data(consoleNames)
            .enter().append('g')
            .attr("transform", function (d, i) {
            {
                return ("translate(0," + i * 1 + ")")
            }
        })

        // Create and position the rectangles for the legend
        legend.append('rect')
            .attr("class", "legend-item")
            .attr("x", (d,i) => {
              for(let j = 0; j < d.length; j++) {
                if(i % 3 == 0) {
                    return (70 * 5);
                } else if (i % 2 == 0) {
                    return (90 * 5);
                  }
                  else {
                    return (110 * 5)
                  }
               }
              })
            .attr("y", (d,i) => {
              for(let j = 0; j < d.length; j++) {
                if(i == 0 || i % 3 == 0) {
                  incrementY ++;
                  return (treemap_H+(30 * incrementY));
                } else {
                  return (treemap_H+(30 * incrementY)); 
                }
              }

            })
            .attr("width", 10)
            .attr("height", 10)
            .style("fill", (d) => color(d));
        
        // Create and position the console names for the legend
        legend.append('text')
          .attr("x", (d,i) => {
            for(let j = 0; j < d.length; j++) {
              if(i % 3 == 0) {
                  return ((70+4) * 5);
              } else if (i % 2 == 0) {
                  return ((90 + 4) * 5);
                }
                else {
                  return ((110+4) * 5);
                }
             }
            }) 
            .attr("y", (d,i) => {
              for(let j = 0; j < d.length; j++) {
                if(i == 0 || i % 3 == 0) {
                  incrementTextY ++;
                  return (treemap_H+10+(30 * incrementTextY));
                } else {
                  return (treemap_H+10+(30 * incrementTextY)); 
                }
              }

            })
        .text(function (d, i) {
            return d
        })
});
