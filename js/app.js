var w=window.innerWidth;
var h=window.innerHeight;
var margin={top:30,right:30,bottom:30,left:30};
var width=w-margin.left-margin.right;
var height=h-margin.top-margin.bottom;
var svg=d3.select("body")
.append("svg")
.attr({id:"chart",
       width:w,
       height:h});
var chart=svg.append("g")
.attr({transform:"translate("+margin.left+","+margin.top+")"});

var path=d3.geo.path()
.projection(null);
//map profit-by-county for merge
var rateById=d3.map();

//define color pallette using colorbrewer
var color=d3.scale.quantize()
.domain([0,0.15])
.range(colorbrewer.Greens[7]);

//use queue to load multiple files asynchronously
queue()
  .defer(d3.json,"us.json")
  .defer(d3.csv,"profit-county.csv",function(d){rateById.set(d.id,+d.rate);})
  .await(ready);

function ready(error,us){
  if(error){
    console.log(error);
  }else{
    console.log(us);
  }
  //draw counties
  chart.append("g")
    .attr("class","counties")
    .selectAll("path")
    .data(topojson.feature(us,us.objects.counties).features)
    .enter().append("path")
    .attr("class","county")
    .attr("d",path)
    .attr("fill",function(d){return color(rateById.get(d.id));});
  chart.append("path")
    .datum(topojson.mesh(us,us.objects.states),function(a,b){return a!==b;})
    .attr("class","states")
    .attr("d",path);
}
