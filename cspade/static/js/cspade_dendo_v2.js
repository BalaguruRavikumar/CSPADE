//Input Data:
//Tree data:
var treedata = (function () {
    var treedata = null;
    $.ajax({
        'async': false,
        'global': false,
        'url': "/static/json/d3-dendrogram_comp.json",
        'dataType': "json",
        'success': function (data) {
        	treedata = data;
        }
    });
    return treedata;
})();

var nsize = 3;
var act = ['mut','WT','Tox'];
var act_col = ['#FA8072','#8FBC8F','Tox'];
var act_sp = [100,150,200];

function project(d) {
    var r = d.y, a = (d.x - 90) / 180 * Math.PI;
    return [r * Math.cos(a), r * Math.sin(a)];
 };

function cross(a, b) { return a[0] * b[1] - a[1] * b[0]; };
function dot(a, b) { return a[0] * b[0] + a[1] * b[1]; };

function step(d) {
     var s = project(d.source),
         m = project({x: d.target.x, y: d.source.y}),
         t = project(d.target),
         r = d.source.y,
         sweep = d.target.x > d.source.x ? 1 : 0;
     return (
       "M" + s[0] + "," + s[1] +
       "A" + r + "," + r + " 0 0," + sweep + " " + m[0] + "," + m[1] +
       "L" + t[0] + "," + t[1]);
};
	
function elbow(d, i) {
      	  return "M" + d.source.y + "," + d.source.x
            + "V" + d.target.x + "H" + d.target.y;
};

function getBB(selection) {
		    selection.each(function(d){d.bbox = this.getBBox();});
};

function highlight(n){
	
	var ind = anno_key.indexOf(n);
	if (anno_value[ind] == u_value[0]){ return "blue"; }
	else if (anno_value[ind] == u_value[1]) {return "red";}
	else {return "black";}	
};

function node_label(){
	node.append("text")
	.attr("dx", function(d) { return d.children ? 8 : 8; })
	.attr("dy", ".28em")
	.style("font-family","sans-serif")
	.style("font-size","8px")
	.style("text-anchor", function(d) { return d.children ? "end" : "start"; })
	.text(function(d) { return d.name; })
	.style("fill",function(d){ 
			if (d.children == null){
				return highlight(d.name);
			}
		});
};

function highoff(checkboxElem){
	if (checkboxElem.checked) {
		svg.selectAll("text").remove(); 
		node_label();
      } else {

    	  svg.selectAll("text")
    	  		.style("fill","black");
      }
    }

function node_actvity(){
	
	for (i = 0; i < act.length; i++) { 
		var dat = treedata[act[i]];
		node.append("circle")         	   
		.attr("cx",function(d) { return d.children ? 0:act_sp[i]; })
		.attr("r", function(d) {
			for (var key in dat) {
				if (d.name == key){
					return dat[key]*2;
				}
			}
		})
		.style("fill", act_col[i])
		.style("stroke", "none");
	}	
};

function transitionToTree() {
		    
		    var nodes = tcluster.nodes(tree), //recalculate layout
		        links = tcluster.links(nodes);
		    
		    svg.transition().duration(duration)
		        .attr("transform", "translate(40,0)");
		  
		    link.data(links)
		        .transition()
		        .duration(duration)
		        .style("stroke", "#8da0cb")
		        .attr("d", tdiagonal); //get the new cluster path

		    node.data(nodes)
		        .transition()
		        .duration(duration)
		        .attr("transform", function (d) {
		            return "translate(" + d.y + "," + d.x + ")";
		        });
		         
};

function transitionToRadial() {
		    
		    var nodes = rcluster.nodes(tree), //recalculate layout
		        links = rcluster.links(nodes);
		    
		    svg.transition().duration(duration)
		        .attr("transform", "translate(" + radius + "," + radius + ")");
		  
		    link.data(links)
		        .transition()
		        .duration(duration)
		        .style("stroke", "#8da0cb")
		        .attr("d", rdiagonal); //get the new cluster path

		    node.data(nodes)
		        .transition()
		        .duration(duration)
		        .attr("transform", function(d) { return "rotate(" + (d.x - 90) + ")translate(" + d.y + ")"; });
};

function generate_tree(){
	
	var nodes = tcluster.nodes(tree), 
    links = tcluster.links(nodes);
	
	svg.transition().duration(duration)
		.attr("transform", "translate(40,0)");

	link.data(links)
		.transition()
		.duration(duration)
		.style("stroke", "#8da0cb")
		.attr("d", tdiagonal); //get the new cluster path
	
	node.data(nodes)
		.transition()
		.duration(duration)
		.attr("transform", function (d) {
		return "translate(" + d.y + "," + d.x + ")";
		});
	
	svg.selectAll("text").remove();
	svg.selectAll("circle").remove();
	
	leaves = svg.selectAll(".node")
				.filter(function(d){return d.children == null; })
				.append("circle")
						.attr("class","leaf")
						.attr("r",nsize);
	
	node_actvity();
	
};

function generate_clust(){
	
	var nodes = rcluster.nodes(tree), 
    links = rcluster.links(nodes);
	
	svg.transition().duration(duration)
    	.attr("transform", "translate(" + radius + "," + radius + ")");

	link.data(links)
		.transition()
		.duration(duration)
		.style("stroke", "#8da0cb")
		.attr("d", rdiagonal); //get the new cluster path
	
	node.data(nodes)
		.transition()
		        .duration(duration)
		        .attr("transform", function(d) { return "rotate(" + (d.x - 90) + ")translate(" + d.y + ")"; });
	
	svg.selectAll("text").remove();
	svg.selectAll("circle").remove();
	
	leaves = svg.selectAll(".node")
				.filter(function(d){return d.children == null; })
				.append("circle")
						.attr("class","leaf")
						.attr("r",nsize);
			
	node_actvity();
	
};

d3.selectAll("input").on("change", function(){
	var dendtype = d3.select('input[name=mode]:checked').attr("value");
	var branchtype = d3.select('input[name=view]:checked').attr("value");	

	if (dendtype == "Tree" && branchtype == "Standard") {
		tdiagonal = elbow;
		transitionToTree();
	}
	else if (dendtype == "Radial" && branchtype == "Standard") {
		rdiagonal = step;
		transitionToRadial();
	}
	else if (dendtype == "Radial" && branchtype == "Path") {
		rdiagonal =  d3.svg.diagonal.radial()
        				   .projection(function(d) { return [d.y, d.x / 180 * Math.PI]; });
		transitionToRadial();
	}
	else {
		tdiagonal = d3.svg.diagonal()
		 				  .projection(function(d) { return [d.y, d.x]; });
		transitionToTree();
	}
});

d3.selectAll("#treetype").on("change", function() {
	
	tree = treedata[this.value];
	var dendtype = d3.select('input[name=mode]:checked').attr("value");
	
	if (dendtype == "Tree") {
		generate_tree();
	}
	else if (dendtype == "Radial"){
		generate_clust();
	}
	
	node_label();
	highoff(checkboxElem);
});

d3.select("#branch").on("input", function() {
	svg.selectAll(".link")
		.attr("stroke-width", +this.value);
});

d3.select("#nlabels").on("input", function() {
	
	svg.selectAll(".node")
		.style("font-size", this.value+"px");

});


d3.select("#node").on("input", function() {
	
	svg.selectAll(".leaf")
	.style("r", +this.value);
	nsize = +this.value;
});

//Dimension of plot:
var width = 1500,
	height = 1500;
var radius = width/2;
var duration = 2000;

var tree = treedata['ecfp4'];

var rcluster = d3.layout.cluster()
          				.size([360, radius-200]);
	 
var tcluster = d3.layout.cluster()
				.size([height, width-500]);

//Path function:
var rdiagonal = d3.svg.diagonal.radial()
                  .projection(function(d) { return [d.y, d.x / 180 * Math.PI]; });

var tdiagonal = d3.svg.diagonal()
				 .projection(function(d) { return [d.y, d.x]; });

//The canvas      
var svg = d3.select("body").append("svg")
          	.attr("width", width-100)
        	.attr("height", height)
	      	.append("g")
	        	.attr("transform", "translate(40,0)");


//The connection path/links in the data 
var nodes = tcluster.nodes(tree);
    
var link = svg.selectAll(".link")
                          .data(tcluster.links(nodes))
                          .enter().append("path")
                                  .attr("class", "link")
                                  .attr("d", tdiagonal)
                              	  .attr("fill","none")
                              	  .attr("stroke","#8da0cb");
//Nodes in data 
var node = svg.selectAll(".node")
				.data(nodes)
				.enter().append("g")
					.attr("class", "node")
					.attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });     

					
//leaf nodes:            
var leaves = svg.selectAll(".node")
				.filter(function(d){return d.children == null; })
				.append("circle")
						.attr("class","leaf")
						.attr("r",3);
	
//Annotation:
var anno = treedata['anno'];
var anno_key =	$.map(anno, function(val, key) { return key; });
var anno_value = $.map(anno, function(val, key) { return val; });
var u_value = anno_value.filter(function(item, i, ar){ return ar.indexOf(item) === i; });


//Label nodes:
node_label();		 

//Activity Circle:	
node_actvity();

nradi();