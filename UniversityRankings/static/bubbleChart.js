function clickableBubbleChart(csvData,colName1,colName2){
    document.getElementById('histogram').innerHTML = "";

    // Convert csv data to hierarchical data in json format *******************
    var root = {"name": "Top Universities",
                "children": []
                };

    // Get unique countries // [not using as of now]
    var uniqueCountries = [];
    for(i = 0; i< csvData.length; i++){
        if(uniqueCountries.indexOf(csvData[i].country) === -1){
            uniqueCountries.push(csvData[i].country);
        }
    }

    for(i=0; i<uniqueCountries.length; i++){
        var jsonData = {};
        jsonData["name"] = uniqueCountries[i];
        // Universitites in Country
        var univInCountry = [];
        for(j=0; j<csvData.length; j++){
            if(csvData[j].country === uniqueCountries[i]){
                var temp = {};
                temp["name"] = csvData[j].university_name;
                temp["size"] = csvData[j].total_score;
                univInCountry.push(temp);
            }
        }
        jsonData["children"] = univInCountry;
        root.children.push(jsonData);
    }
    //********************************************************************************

    var margin = 10,
    outerDiameter = 650,
    innerDiameter = outerDiameter - margin - margin;

    var x = d3.scale.linear()
        .range([0, innerDiameter]);

    var y = d3.scale.linear()
        .range([0, innerDiameter]);

    var color = d3.scale.linear()
        .domain([-1, 5])
        .range(["hsl(152,80%,80%)", "hsl(228,30%,40%)"])
        .interpolate(d3.interpolateHcl);

    var pack = d3.layout.pack()
        .padding(2)
        .size([innerDiameter, innerDiameter])
        .value(function(d) { return d.size; })

    var svg = d3.select("#clickableBubble").append("svg")
        .attr("width", outerDiameter)
        .attr("height", outerDiameter)
      .append("g")
        .attr("transform", "translate(" + margin + "," + margin + ")");

    var focus = root;
    var nodes = pack.nodes(root);

    svg.append("g").selectAll("circle")
         .data(nodes)
        .enter().append("circle")
        .attr("class", function(d) { return d.parent ? d.children ? "node" : "node node--leaf" : "node node--root"; })
        .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
        .attr("r", function(d) { return d.r; })
        .style("fill", function(d) { return d.children ? color(d.depth) : null; })
        .on("click", function(d) { return zoom(focus == d ? root : d); });

    svg.append("g").selectAll("text")
         .data(nodes)
        .enter().append("text")
        .attr("class", "label")
        .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
        .style("fill-opacity", function(d) { return d.parent === root ? 1 : 0; })
        .style("display", function(d) { return d.parent === root ? null : "none"; })
        .text(function(d) { return d.name; });

    d3.select(window)
        .on("click", function() { zoom(root); });

    function zoom(d, i) {
        var focus0 = focus;
        focus = d;

        var k = innerDiameter / d.r / 2;
        x.domain([d.x - d.r, d.x + d.r]);
        y.domain([d.y - d.r, d.y + d.r]);
        d3.event.stopPropagation();

        var transition = d3.select("#clickableBubble").selectAll("text,circle").transition()
            .duration(d3.event.altKey ? 7500 : 750)
            .attr("transform", function(d) { return "translate(" + x(d.x) + "," + y(d.y) + ")"; });

        transition.filter("circle")
            .attr("r", function(d) { return k * d.r; });

        transition.filter("text")
            .filter(function(d) { return d.parent === focus || d.parent === focus0; })
                .style("fill-opacity", function(d) { return d.parent === focus ? 1 : 0; })
            .each("start", function(d) { if (d.parent === focus) this.style.display = "inline"; })
            .each("end", function(d) { if (d.parent !== focus) this.style.display = "none"; });
    }
}

function bubbleChart(csvData,colName1, colName2){
    document.getElementById('bubble').innerHTML = "";

    var univ_count = 'univ_count';
    var bubbleObj = {};
    for( i=0; i<csvData.length; i++){
        var item = csvData[i];
        if(bubbleObj[item.country] === undefined){
            bubbleObj[item.country] = 0;
        }
        bubbleObj[item.country] += 1;
    }
    var bubbleValues = [];
    for(i in bubbleObj){
        bubbleValues.push({'country':i, [univ_count]:bubbleObj[i]});
    }

    var data = bubbleValues;
    var diameter = 500; //max size of the bubbles
    var color    = d3.scale.category10(); //color category

    var bubble = d3.layout.pack()
        .sort(null)
        .size([diameter, diameter])
        .padding(1.5);

    var svg = d3.select("#bubble")
        .append("svg")
        .attr("width", diameter)
        .attr("height", diameter)
        .attr("class", "bubble");

    //convert numerical values from strings to numbers
    data = data.map(function(d){ d.value = +d[colName2]; return d; });

    //bubbles needs very specific format, convert data to this.
    var nodes = bubble.nodes({children:data}).filter(function(d) { return !d.children; });

    //setup the chart
    var bubbles = svg.append("g")
        .attr("transform", "translate(0,0)")
        .selectAll(".bubble")
        .data(nodes)
        .enter();

    //create the bubbles
    bubbles.append("circle")
        .attr("r", function(d){ return d.r; })
        .attr("cx", function(d){ return d.x; })
        .attr("cy", function(d){ return d.y; })
        .style("fill", function(d) { return color(d.value); });

    //format the text for each bubble
    bubbles.append("text")
        .attr("x", function(d){ return d.x; })
        .attr("y", function(d){ return d.y + 5; })
        .attr("text-anchor", "middle")
        .text(function(d){ return d[colName1]; })
        .append("tspan")
        .attr("dy", "1.2em") // offest by 1.2 em
        .attr("x",0)
        .text(function(d) {return d[colName2];})
        .style({
            "fill":"black",
            "font-family":"Helvetica Neue, Helvetica, Arial, san-serif",
            "font-size": "12px"
        });
}