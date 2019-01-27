var svgWidth = 850;
var svgHeight = 550;

var margin = {
  top: 30,
  right: 30,
  bottom: 30,
  left: 30
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

var padding = 25; 
var formatPercent = d3.format('.2%');

// Create an SVG wrapper, append an SVG group that will hold our chart
var svg = d3
    .select(".chart")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight)

// Append an SVG group and shift margins by right and top
    .append("g")
    .attr("transform", `translate(${margin.right}, ${margin.top})`);

// Append an SVG group
var chart = svg.append("g");

d3.select(".chart")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

// Load data from CSV
d3.csv("data.csv", function(error, newsData) {
  for (var i = 0; i < newsData.length; i++){
        
        console.log(newsData[i].abbr)
  } 
  if (error) throw error;
  newsData.forEach(function(d) {

      d.poverty = +d.poverty;
      d.healthcare = +d.healthcare;
  });

// Scale the data
  var x = d3.scaleLinear()
    .range([0, width]);

// Create a linear scale
  var y= d3.scaleLinear()
    .range([height, 0]);

  var xAxis = d3.axisBottom(x);
  var yAxis = d3.axisLeft(y);

  function getMinMax(i) {
        xMin = d3.min(newsData, function(d) {
            return +d[i] * 0.8;
        });

        xMax =  d3.max(newsData, function(d) {
            return +d[i] * 1.1;
        });

        yMax = d3.max(newsData, function(d) {
            return +d.healthcare * 1.1;
        });
  };
    
  var currentAxisXLabel = "poverty";

// Use getMinMax() with Poverty field the default
  getMinMax(currentAxisXLabel);

// Scale axes to Min/Max
  xScale=x.domain([xMin, xMax]);
  yScale=y.domain([0, yMax]);      
 
  var toolTip = d3.tip()
        .attr("class", "tooltip")
        .html(function(d) {
            var state = d.abbr;
            var poverty = +d.poverty;
            var healthcare = +d.healthcare;
            return (state + "<br>Impoverished: " + poverty + "<br>Lacking Healthcare: " + healthcare + "%");
      });

  chart.call(toolTip);
                
  // Markers
  circles = chart
        .selectAll('circle')
        .data(newsData)
        .enter()
        .append('circle')
        .attr("class", "circle")
        .attr("cx", function(d,index) {
            return x(+d[currentAxisXLabel]);
        })
        .attr("cy", function(d,index) {
            return y(d.healthcare);
        })   
        .attr('r','10')
        .attr('stroke','black')
        .attr('stroke-width', 1)
        .style('fill', "lightblue")
        .attr("class", "circleText")
        .on("mouseover", function(d) {
          toolTip.show(d);
        })
        // onmouseout event
        .on("mouseout", function(d, index) {
          toolTip.hide(d);
        });              
     
  
// Labels
  circles
         .append('text')
         .attr("x", function(d, index) {
            return x(+d[currentAxisXLabel]- 0.08);
        })
         .attr("y", function(d, index) {
            return y(d.healthcare - 0.2);
        })
    
        .attr("text-anchor", "middle")
        .text(function(d){
            return d.abbr;})
        .attr('fill', 'white')
        .attr('font-size', 9);
  
  
// X-axis
  xAxis = d3.axisBottom(x);
  chart.append("g")
       .attr("class", "xaxis")
       .attr("transform", "translate(0," + height + ")")
       .call(xAxis);
    
  chart.append("text")
       .attr("class", "label")
       .attr("transform", "translate(" + (width / 2) + " ," + (height - margin.top+ 60) + ")")
       .style("text-anchor", "middle")
       .text('Impoverished (%) ');

  // Y-axis
  yAxis = d3.axisLeft(y);        
  chart.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(" + padding + ",0)")
        .call(yAxis);       
                
   chart.append("text")
       .attr("class", "label")
       .attr("transform", "rotate(-90)")
       .attr("y", 0 - (margin.left + 4))
       .attr("x", 0 - (height/ 2))
       .attr("dy", "1em")
       .style("text-anchor", "middle")
       .text('Lacking Healthcare (%)');
});