function act_legend(){

if ( act.length > 0){
  if (measure == 'DSS'){

    var legend4 = svg.append('g')
              .attr("class", "legend2")

     legend4.append("g")
          .append("circle")
          .attr("cx",lx)
          .attr("cy", 120 + 30)
          .attr("r",2);

    legend4.append("g")
          .append("circle")
          .attr("cx",lx+55+25)
          .attr("cy", 120 + 30)
          .attr("r",8);

    legend4.append("g")
      .append("polygon")  
      .style("stroke", "none")  // colour the line
      .style("fill", "blue")     // remove any fill colour
      .attr("points", lx +10 + ",150," + (lx + 55) +",140,"+(lx + 55)+",160");
   
    legend4.append("g")
      .append("text")
      .text('Potency ('+treedata['in_par']+')')
      .style("font-size", "12px")
      .style("font-family", "sans-serif")
      .attr("x", lx-10)
      .attr("y", 120);  






  }else if(measure == 'AUC') {

   svg.append("g")
          .attr("class", "legend2")
          .append("circle")
          .attr("cx",lx)
          .attr("cy", 120 + 30)
          .attr("r",2);

    svg.append("g")
          .attr("class", "legend2")
          .append("circle")
          .attr("cx",lx+55+25)
          .attr("cy", 120 + 30)
          .attr("r",8);

    svg.append("polygon")
    .attr("class", "legend2")// attach a polygon
      .style("stroke", "none")  // colour the line
      .style("fill", "blue")     // remove any fill colour
      .attr("points", lx +10 + ",150," + (lx + 55) +",140,"+(lx + 55)+",160");
   
    svg.append("g")
      .attr("class", "legend2")
      .append("text")
      .text(treedata['in_par'])
      .style("font-size", "12px")
      .style("font-family", "sans-serif")
      .attr("x", lx-10)
      .attr("y", 120); 

  }else{


  var legend2 = svg.append("g")
          .attr("class", "legend2")
          .attr("x", width - lx)
          .attr("y", 700)
          .attr("height", 30)
          .attr("width", 50);


    legend2.selectAll('g').data(atext)
      .enter()
      .append('g')
      .each(function(d, i) {
      
       var g2 = d3.select(this);
       
        g2.append("circle")
          .attr("cx", lx)
        .attr("cy", i * 25 + 58)
        .attr("class","actsize")
          .attr("r", (a_hash[i][0]*1.25)-1)
          .style("fill","black" );
        
        g2.append("text")
          .attr("x", lx+20) 
          .attr("y", i * 25 + 61) 
          .attr("height",30)
        .attr("width",100)
          .style("fill", "black")
          .style("font-size", "10px")
          .style("font-family", "sans-serif")
          .text(a_hash[i][1]);
      });
    
    legend2.selectAll('g')
      .append("text")
      .text("Bioactivity "+treedata['in_par'].join(" "))
      .style("font-size", "12px")
      .style("font-family", "sans-serif")
      .attr("x", lx-10)
      .attr("y", 30);
    }

  }  
}




function att_legend(){

  var legend = svg.append("g")
          .attr("class", "legend")
          .attr("x", width - 100)
          .attr("y", 700)
          .attr("height", 30)
          .attr("width", 50);
  
  legend.selectAll('g').data(leg_col)
            .enter()
            .append('g')
            .each(function(d, i) {

             var g = d3.select(this);
              g.append("circle")
                .attr('class',leg_hash[i][0].replace(/[^a-zA-Z0-9]+/g, "-"))
                .attr("cx", lx)
                .attr("cy", i * 25 + 230 ) // IF DSS OR AUC then add 10 else 230
                .attr("r", 4)
                .attr("fill", leg_hash[i][1]);
              
              g.append("text")
                .attr("x", lx+20) 
                .attr("y", i * 25 + 235 ) 
                .attr("height",30)
                .attr("width",100)
                .attr("fill", "black")
                .style("font-size", "10px")
                .style("font-family", "sans-serif")
                .text(leg_hash[i][0]);
            });
  
  legend.selectAll('g')
    .append("text")
    .text("Activity Class")
    .style("font-size", "12px")
    .style("font-family", "sans-serif")
    .attr("x", lx-10)
    .attr("y", 205);
};


function cmpd_legend(){

  var legend3 = svg.append("g")
          .attr("class", "legend3")
          .attr("x", width - 100)
          .attr("y", 800)
          .attr("height", 30)
          .attr("width", 50);
  
  legend3.selectAll('g').data(ucol)
            .enter()
            .append('g')
            .each(function(d, i) {

             var g3 = d3.select(this);
              g3.append("circle")
                .attr('class',c_hash[i][0].replace(/[^a-zA-Z0-9]+/g, "-"))
                .attr("cx", lx)
                .attr("cy", i * 25 + cs+20  ) 
                .attr("r", 4)
                .attr("fill", c_hash[i][1]);
              
              g3.append("text")
                .attr("x", lx+20) 
                .attr("y", i * 25 + cs+25 ) 
                .attr("height",30)
                .attr("width",100)
                .style("fill", "black")
                .style("font-size", "10px")
                .style("font-family", "sans-serif")
                .text(c_hash[i][0]);
            });
  
  legend3.selectAll('g')
    .append("text")
    .text("Compound Annotation")
    .style("font-size", "12px")
    .style("font-family", "sans-serif")
    .attr("x", lx-10)
    .attr("y", cs);

};

function leg_trans_tree(){
  
  svg.selectAll(".legend,.legend2,.legend3")
      .transition()
      .duration(duration)
      .attr("transform", "translate(40,0)");
  
};

rlx = -lx + 430;
function leg_trans_rot(vrot){
  
  svg.selectAll(".legend,.legend2,.legend3")
      .transition()
      .duration(duration)
      .attr("transform", "rotate("+-vrot+",0,0) translate("+rlx+",-350)" );

};

function highoff(checkboxElem){
  if (checkboxElem.checked) 
  {
    svg.selectAll('.cmpdlabel').remove(); 
    node_label();
    cmpd_legend();
    leg_trans_tree();
    
      } 
  else 
  {
      svg.selectAll('.cmpdlabel')
       .style("fill","black");  
      svg.selectAll('.legend3').remove();       
  }
};

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

function interpolateZoom (translate, scale) {
    var self = this;
    return svg.transition().duration(350).tween("zoom", function () {
        var iTranslate = d3.interpolate(zoom.translate(), translate),
            iScale = d3.interpolate(zoom.scale(), scale);
        return function (t) {
            zoom
                .scale(iScale(t))
                .translate(iTranslate(t));
            zoomed();
        };
    });
}
function zoomClick() {
  
  
    var clicked = d3.event.target,
        direction = 1,
        factor = 0.2,
        target_zoom = 1,
        center = [width / 2, height / 2],
        extent = zoom.scaleExtent(),
        translate = zoom.translate(),
        translate0 = [],
        l = [],
        view = {x: translate[0], y: translate[1], k: zoom.scale()};

    d3.event.preventDefault();
    direction = (this.id === 'zoom_in') ? 1 : -1;
    target_zoom = zoom.scale() * (1 + factor * direction);

    if (target_zoom < extent[0] || target_zoom > extent[1]) { return false; }

    translate0 = [(center[0] - view.x) / view.k, (center[1] - view.y) / view.k];
    view.k = target_zoom;
    l = [translate0[0] * view.k + view.x, translate0[1] * view.k + view.y];

    view.x += center[0] - l[0];
    view.y += center[1] - l[1];

    interpolateZoom([view.x, view.y], view.k);
    
}

function transitionToTree() {
        
        var nodes = tcluster.nodes(tree), //recalculate layout
            links = tcluster.links(nodes);
        
        svg.transition().duration(duration)
            .attr("transform", "translate(40,0)");
      
        link.data(links)
            .transition()
            .duration(duration)
            .attr("d", tdiagonal); //get the new cluster path
        
        var y = d3.scale.sqrt().range([0, height]); 
        
        
        node.data(nodes)
            .transition()
            .duration(duration)
            .attr("transform", function (d) {
                return "translate(" + d.y + "," + d.x + ")";
            });
        
        leg_trans_tree();
        zoom.translate([40, 0]);
      
};

function transitionToRadial() {
        
  
        var nodes = rcluster.nodes(tree), //recalculate layout
            links = rcluster.links(nodes);
                      
          svg.transition().duration(duration)
                .attr("transform", "translate(" + (width/2) + "," + (height/2 ) + ") rotate("+nrot+")");
      
          link.data(links)
                .transition()
                .duration(duration)
                // .style("stroke", "#8da0cb")
                .attr("d", rdiagonal); //get the new cluster path

          node.data(nodes)
                  .transition()
                  .duration(duration)
                  .attr("transform", function(d) { return "rotate(" + (d.x - 90) + ")translate(" + d.y + ")"; });
     
      leg_trans_rot(nrot);
      zoom.translate([(width/2), height/2]);
};

function center (){
    var dendtype = d3.select('input[name=mode]:checked').attr("value");
    if (dendtype == "Tree") {         
      svg.transition().duration(duration)
        .attr("transform", "translate(40,0)");
    }else{

      svg.transition().duration(duration)
        .attr("transform", "translate(" + width/2 + "," + height/2 + ") rotate("+ nrot + ")");
    }

}


function generate_tree(){
  
  var nodes = tcluster.nodes(tree), 
    links = tcluster.links(nodes);
  
  svg.transition().duration(duration)
    .attr("transform", "translate(40,0)");

  link.data(links)
    .transition()
    .duration(duration)
    .attr("d", tdiagonal); //get the new cluster path
  
  
  node.data(nodes)
    .transition()
    .duration(duration)
    .attr("transform", function (d) {
    return "translate(" + d.y + "," + d.x + ")";
    });
  
  svg.selectAll("text").remove();
  svg.selectAll("circle").remove();
   svg.selectAll("polygon").remove();

  leaves = svg.selectAll(".node")
        .filter(function(d){return d.children == null; })
        .append("circle")
            .attr("class","leaf")
            .attr("r",nsize);
  
  node_actvity();
  leg_trans_tree();
  zoom.translate([40, 0]);
    
};

function generate_clust(){
  
  var nodes = rcluster.nodes(tree), 
    links = rcluster.links(nodes);
  
  svg.transition().duration(duration)
      .attr("transform", "translate(" + width/2 + "," + height/2 + ") rotate("+ nrot + ")");
    
  link.data(links)
    .transition()
    .duration(duration)
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
  att_legend();
  act_legend();
  cmpd_legend();
  
  leg_trans_rot(nrot);
  zoom.translate([width/2, height/2]);
 
};

function change_mode(){

  dendtype = d3.select('input[name=mode]:checked').attr("value");
  branchtype = d3.select('input[name=view]:checked').attr("value");

  if (dendtype == "Tree" && branchtype == "Standard") {
    tdiagonal = elbow;
    transitionToTree();
    $('#rotate-control').hide();
  }
  else if (dendtype == "Radial" && branchtype == "Standard") {
    $('#rotate-control').show();
    rdiagonal = step;
    transitionToRadial();
    
  }
  else if (dendtype == "Radial" && branchtype == "Path") {
    $('#rotate-control').show();
    rdiagonal =  d3.svg.diagonal.radial()
                   .projection(function(d) { return [d.y, d.x / 180 * Math.PI]; });
    transitionToRadial();
    
    }
  else {
    $('#rotate-control').hide();
    tdiagonal = d3.svg.diagonal()
              .projection(function(d) { return [d.y, d.x]; });
    transitionToTree();
  }
}

function downloadURI(uri, name) {
  var link = document.createElement("a");
  link.download = name;
  link.href = uri;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  delete link;
}

unction zoomed() {
var t_type = d3.select('input[name=mode]:checked').attr("value");
  if (t_type == "Tree") {
    svg.attr("transform", "translate(" + zoom.translate() + ")scale(" + zoom.scale() + ") ");
  }
  else if (t_type == "Radial"){
    svg
      .attr("transform", "translate("+ zoom.translate() + ") scale(" + zoom.scale() + ") rotate("+nrot+")");
  }  
}
function find_cmpd_in_clust(){

    search_cmpd = $('#cmpd_search_box').val();

    if (cname.indexOf(search_cmpd) != -1){

      highlight_found_cmpd(search_cmpd);
      
    }
    else{
      window.alert("Not Found")
    }
};

function highlight_found_cmpd(search_cmpd) {
    
  var bbox =  svg.selectAll('.node')
    .filter(function(d){ return d.name == search_cmpd})
    .select('text')[0][0]
    .getBBox(); 
  
  svg.selectAll('.node')
    .filter(function(d){ return d.name == search_cmpd})
    .append('rect')
    .attr('class','highlight')
    .attr('x', bbox.x-2)
    .attr('y', bbox.y-2)
    .attr('width', bbox.width+5)
    .attr('height', 8)
    .style('fill','yellow')
    .style('opacity',0.5);
};

function remove_search(text){
  
  svg.selectAll('.highlight').remove();

};
  

//Colour generator:
function randomColor () {
    var max = 0xffffff;
    return '#' + Math.round( Math.random() * max ).toString( 16 );
};

function intersect(arr1,arr2){
  var commonValues = arr1.filter(function(value) { 
      return arr2.indexOf(value) > -1;
  });
  return commonValues;
};

//Activity Names:
Array.prototype.diff = function(a) {
    return this.filter(function(i) {return a.indexOf(i) < 0;});
};




if (typeof act != 'undefined'){
  var act_col= [];
  var act_sp=[];
  
  for (j = 0; j < act.length; j++){
    act_col[j] = randomColor();
    if(j ==0){  act_sp[j] = 80;}
    else {  act_sp[j] = act_sp[j-1] + 30; }
  };
};

var tooltip_act = d3.select("body")
          .append("div")
          .style("position", "absolute")
          .style("z-index", "100")
//              .style("width","15px")                  
//              .style("height","20px")               
              .style("padding","5px")             
              .style("font","16px sans-serif")
              //.style("border","5px") 
              //.style("font-weight", "bold")
              .style("border-radius","3px")  
              .style("background",  "#ececec")
          .style("visibility", "hidden");


function node_actvity(){
  
  for (i = 0; i < act.length; i++) { 
    var dat = treedata[act[i]];
    activity_radius = 1.25
    if (measure == 'DSS' || measure == 'AUC') activity_radius = 2.5

    var n_activity = node.append("circle")
              .attr("class",act[i].replace(/[^a-zA-Z0-9]+/g, "-"))
              .attr("cx",act_sp[i])
              .attr("r", function(d) {
                for (var key in dat) {
                  if (d.name == key && dat[key][0] != 0){            
                    return (dat[key][0]+activity_radius);
                  }
                }
              })
      .attr("fill", act_col[i])
      .attr("val", function(d) {
                for (var key in dat) {
                  if (d.name == key){
                    return (dat[d.name][1]);
                  }
                }
              })
              .on("mouseover", function(d){
                var num = d3.select(this).attr("val");
                tooltip_act.text(num); 
            tooltip_act.style("visibility", "visible");
      })
      .on("mousemove", function(){
            return tooltip_act.style("top", (d3.event.pageY+                   
                                    10)+"px").style("left",(d3.event.pageX+10)+"px");
      })
     .on("mouseout", function(){return tooltip_act.style("visibility", "hidden");});
      
      
  }
};

function node_label(){
  node.append("text")
  .attr("class",function(d){
    if (d.children == null){
      return annotate(d.name);
    }
  })
  .attr("dx", function(d) { return d.children ? 8 : 8; })
  .attr("dy", ".28em")
  .style("font-family","sans-serif")
  .attr("font-size",labelsize + 'px')
  .style("text-anchor", function(d) { return d.children ? "end" : "start"; })
  .text(function(d) { return d.name; })
  .attr("fill",function(d){
      if (d.children == null){
        return highlight(d.name);
      }
    })
  .on("mouseover", function(d){
        tooltip.text(d.name); 
        tooltip.append("img")
                .attr("src",img_file[d.name])
                .attr("x", 200)
                .attr("y", 200)
                .attr("width","180px")                  
                .attr("height","180px"); 
        tooltip.style("visibility", "visible");
    })
    .on("mousemove", function(){return tooltip.style("top", (d3.event.pageY-                   
                                  10)+"px").style("left",(d3.event.pageX+10)+"px");})
    .on("mouseout", function(){return tooltip.style("visibility", "hidden");});

};


function highlight(n){
  if (typeof anno != 'undefined'){
    
    var ind = anno_key.indexOf(n);
    var canno = u_value.indexOf(anno_value[ind]);
    
    if(canno != -1)
      {
        return ucol[canno];
      }
    else { return "black";}
    
  }
  else
    {
      $('input:checkbox').prop('checked',false);
      return "black";
    }
  
};

function annotate(n){
  if (typeof anno != 'undefined'){
    
    var ind = anno_key.indexOf(n);
    var canno = u_value.indexOf(anno_value[ind]);
    
    if(canno != -1)
      {
        return anno_value[ind].replace(/[^a-zA-Z0-9]+/g, "-") + ' cmpdlabel';
      }
    else { return "cmpdlabel";}

    
  }else{
    return 'cmpdlabel'
  }  
};



function zoomed() {
var t_type = d3.select('input[name=mode]:checked').attr("value");
  if (t_type == "Tree") {
    svg.attr("transform", "translate(" + zoom.translate() + ")scale(" + zoom.scale() + ") ");
  }
  else if (t_type == "Radial"){
    svg
      .attr("transform", "translate("+ zoom.translate() + ") scale(" + zoom.scale() + ") rotate("+nrot+")");
  }  
}
function find_cmpd_in_clust(){

    search_cmpd = $('#cmpd_search_box').val();

    if (cname.indexOf(search_cmpd) != -1){

      highlight_found_cmpd(search_cmpd);
      
    }
    else{
      window.alert("Not Found")
    }
};

function highlight_found_cmpd(search_cmpd) {
    
  var bbox =  svg.selectAll('.node')
    .filter(function(d){ return d.name == search_cmpd})
    .select('text')[0][0]
    .getBBox(); 
  
  svg.selectAll('.node')
    .filter(function(d){ return d.name == search_cmpd})
    .append('rect')
    .attr('class','highlight')
    .attr('x', bbox.x-2)
    .attr('y', bbox.y-2)
    .attr('width', bbox.width+5)
    .attr('height', 8)
    .style('fill','yellow')
    .style('opacity',0.5);
};

function remove_search(text){
  
  svg.selectAll('.highlight').remove();

};
  

//Colour generator:
function randomColor () {
    var max = 0xffffff;
    return '#' + Math.round( Math.random() * max ).toString( 16 );
};

function intersect(arr1,arr2){
  var commonValues = arr1.filter(function(value) { 
      return arr2.indexOf(value) > -1;
  });
  return commonValues;
};

//Activity Names:
Array.prototype.diff = function(a) {
    return this.filter(function(i) {return a.indexOf(i) < 0;});
};




if (typeof act != 'undefined'){
  var act_col= [];
  var act_sp=[];
  
  for (j = 0; j < act.length; j++){
    act_col[j] = randomColor();
    if(j ==0){  act_sp[j] = 80;}
    else {  act_sp[j] = act_sp[j-1] + 30; }
  };
};

var tooltip_act = d3.select("body")
          .append("div")
          .style("position", "absolute")
          .style("z-index", "100")
//              .style("width","15px")                  
//              .style("height","20px")               
              .style("padding","5px")             
              .style("font","16px sans-serif")
              //.style("border","5px") 
              //.style("font-weight", "bold")
              .style("border-radius","3px")  
              .style("background",  "#ececec")
          .style("visibility", "hidden");


function node_actvity(){
  
  for (i = 0; i < act.length; i++) { 
    var dat = treedata[act[i]];
    activity_radius = 1.25
    if (measure == 'DSS' || measure == 'AUC') activity_radius = 2.5

    var n_activity = node.append("circle")
              .attr("class",act[i].replace(/[^a-zA-Z0-9]+/g, "-"))
              .attr("cx",act_sp[i])
              .attr("r", function(d) {
                for (var key in dat) {
                  if (d.name == key && dat[key][0] != 0){            
                    return (dat[key][0]+activity_radius);
                  }
                }
              })
      .attr("fill", act_col[i])
      .attr("val", function(d) {
                for (var key in dat) {
                  if (d.name == key){
                    return (dat[d.name][1]);
                  }
                }
              })
              .on("mouseover", function(d){
                var num = d3.select(this).attr("val");
                tooltip_act.text(num); 
            tooltip_act.style("visibility", "visible");
      })
      .on("mousemove", function(){
            return tooltip_act.style("top", (d3.event.pageY+                   
                                    10)+"px").style("left",(d3.event.pageX+10)+"px");
      })
     .on("mouseout", function(){return tooltip_act.style("visibility", "hidden");});
      
      
  }
};

function node_label(){
  node.append("text")
  .attr("class",function(d){
    if (d.children == null){
      return annotate(d.name);
    }
  })
  .attr("dx", function(d) { return d.children ? 8 : 8; })
  .attr("dy", ".28em")
  .style("font-family","sans-serif")
  .attr("font-size",labelsize + 'px')
  .style("text-anchor", function(d) { return d.children ? "end" : "start"; })
  .text(function(d) { return d.name; })
  .attr("fill",function(d){
      if (d.children == null){
        return highlight(d.name);
      }
    })
  .on("mouseover", function(d){
        tooltip.text(d.name); 
        tooltip.append("img")
                .attr("src",img_file[d.name])
                .attr("x", 200)
                .attr("y", 200)
                .attr("width","180px")                  
                .attr("height","180px"); 
        tooltip.style("visibility", "visible");
    })
    .on("mousemove", function(){return tooltip.style("top", (d3.event.pageY-                   
                                  10)+"px").style("left",(d3.event.pageX+10)+"px");})
    .on("mouseout", function(){return tooltip.style("visibility", "hidden");});

};


function highlight(n){
  if (typeof anno != 'undefined'){
    
    var ind = anno_key.indexOf(n);
    var canno = u_value.indexOf(anno_value[ind]);
    
    if(canno != -1)
      {
        return ucol[canno];
      }
    else { return "black";}
    
  }
  else
    {
      $('input:checkbox').prop('checked',false);
      return "black";
    }
  
};

function annotate(n){
  if (typeof anno != 'undefined'){
    
    var ind = anno_key.indexOf(n);
    var canno = u_value.indexOf(anno_value[ind]);
    
    if(canno != -1)
      {
        return anno_value[ind].replace(/[^a-zA-Z0-9]+/g, "-") + ' cmpdlabel';
      }
    else { return "cmpdlabel";}

    
  }else{
    return 'cmpdlabel'
  }  
};