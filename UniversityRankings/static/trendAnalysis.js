//function getCheckedCheckboxesFor(checkboxName) {
//    var checkboxes = document.querySelectorAll('input[name="' + checkboxName + '"]:checked'), values = [];
//    Array.prototype.forEach.call(checkboxes, function(el) {
//        values.push(el.value);
//    });
//    universityRankTrend = getRank(values);
//    lineChart(universityRankTrend);
//}

function getRank(universities){
    univRankTrend = [];
    for(var i=0; i<g_timesData_2011.length; i++){
        for(var j=0; j<universities.length; j++){
            if(g_timesData_2011[i].university_name === universities[j]){
                jsonTemp = {};
                jsonTemp["university"] = universities[j];
                jsonTemp["date"] = 2011;
                jsonTemp["rank"] = g_timesData_2011[i].world_rank;
                univRankTrend.push(jsonTemp);
                break;
            }
        }
    }
    for(var i=0; i<g_timesData_2012.length; i++){
        for(var j=0; j<universities.length; j++){
            if(g_timesData_2012[i].university_name === universities[j]){
                jsonTemp = {};
                jsonTemp["university"] = universities[j];
                jsonTemp["date"] = 2012;
                jsonTemp["rank"] = g_timesData_2012[i].world_rank;
                univRankTrend.push(jsonTemp);
                break;
            }
        }
    }
    for(var i=0; i<g_timesData_2013.length; i++){
        for(var j=0; j<universities.length; j++){
            if(g_timesData_2013[i].university_name === universities[j]){
                jsonTemp = {};
                jsonTemp["university"] = universities[j];
                jsonTemp["date"] = 2013;
                jsonTemp["rank"] = g_timesData_2013[i].world_rank;
                univRankTrend.push(jsonTemp);
                break;
            }
        }
    }
    for(var i=0; i<g_timesData_2014.length; i++){
        for(var j=0; j<universities.length; j++){
            if(g_timesData_2014[i].university_name === universities[j]){
                jsonTemp = {};
                jsonTemp["university"] = universities[j];
                jsonTemp["date"] = 2014;
                jsonTemp["rank"] = g_timesData_2014[i].world_rank;
                univRankTrend.push(jsonTemp);
                break;
            }
        }
    }
    for(var i=0; i<g_timesData_2015.length; i++){
        for(var j=0; j<universities.length; j++){
            if(g_timesData_2015[i].university_name === universities[j]){
                jsonTemp = {};
                jsonTemp["university"] = universities[j];
                jsonTemp["date"] = 2015;
                jsonTemp["rank"] = g_timesData_2015[i].world_rank;
                univRankTrend.push(jsonTemp);
                break;
            }
        }
    }
    for(var i=0; i<g_timesData_2016.length; i++){
        for(var j=0; j<universities.length; j++){
            if(g_timesData_2016[i].university_name === universities[j]){
                jsonTemp = {};
                jsonTemp["university"] = universities[j];
                jsonTemp["date"] = 2016;
                jsonTemp["rank"] = g_timesData_2016[i].world_rank;
                univRankTrend.push(jsonTemp);
                break;
            }
        }
    }


    return univRankTrend;
}

function lineChart(data){
console.log(data);
//        data = data.slice(1,31);
    console.log('lineChart', data);
    document.getElementById("stackBar").innerHTML = "";
    document.getElementById("stackBarTitle").innerHTML = "<b>Trend in the rank of University over the years</b>"

    // Set the canvas dimensions
    var margin = {top: 30, right: 180, bottom: 70, left: 50},
        width = 850 - margin.left - margin.right,
        height = 450 - margin.top - margin.bottom;

    // Set the x and y values
    var x = d3.time.scale().range([0, width]);
    var y = d3.scale.linear().range([height, 0]);

    //Format d.date variable
    var formatTime = d3.time.format("%Y");

    // Define the axes
    var xAxis = d3.svg.axis().scale(x)
        .orient("bottom").ticks(5);

    var yAxis = d3.svg.axis().scale(y)
        .orient("left").ticks(10);

    // Define the line
    var dataline = d3.svg.line()
        .x(function(d) { return x(d.date); })
        .y(function(d) { return y(d.rank); });

    // Adds the canvas
    var svg = d3.select("#stackBar")
        .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .attr("font", "Arial")
            .style("font-size","14px")
        .append("g")
            .attr("transform",
                  "translate(" + margin.left + "," + margin.top + ")");

    // Add the div for the tooltip
    var div = d3.select("#line").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    data.forEach(function(d) {
        d.date = new Date(+d.date,0,1);
        d.rank = +d.rank;
    });

    // Nest the entries by university
    var dNest = d3.nest()
      .key(function(d) {return d.university;})
      .entries(data);

    // set the colour scale
    var color = d3.scale.category10();

    // Scale the range of the data
    x.domain(d3.extent(data, function(d) { return d.date; }));
    y.domain([0, d3.max(data, function(d) { return d.rank; })]);

    // spacing for the legend
    legendSpace = width/dNest.length;

    // Add the X Axis
    svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

    // Add the Y Axis
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
            .attr("class", "label")
            .attr("y", 6)
            .attr("transform", "rotate(-90)")
            .attr("dy", ".71em")
            .text("Rank")
            .style("text-anchor", "end")
            .style("font-weight", "bold")
            .style("font-size", "16px");

    // Loop through each university / key
    svg.selectAll("path.line")
        .data(dNest)
            .enter().append('path')
        .attr("class", "line")
        .style("stroke", function(d) { // Add the colours dynamically
            return color(d.key);
        })
        .attr("id", function(d) {
            return 'tag'+d.key.replace(/\s+/g, ''); // assign ID
        })
        .attr("stroke-width", 2)
        .attr("fill","none")
        .attr("d", function (d) {
            return dataline(d.values);
        });

    // Add the dots for the tooltip
    svg.selectAll("dot")
            .data(data)
        .enter().append("circle")
            .attr("r", 2)
            .attr("cx", function(d) { return x(d.date); })
            .attr("cy", function(d) { return y(d.rank); })
            .style("fill", function(d) {return color(d.university)})
            .attr("id", function (d) {
                return 'tag'+d.university.replace(/\s+/g, '');
            })
            .on("mouseover", function(d) {
                div.transition()
                    .duration(200)
                    .style("opacity", .9);
                div.html("Year: " + formatTime(d.date) + "<br/>"  + d.rank)
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY - 28) + "px");
            })
        .on("mouseout", function(d) {
            div.transition()
                .duration(500)
                .style("opacity", 0);
        });

    // Add the Legend
    svg.selectAll("text.legend")
            .data(dNest)
        .enter().append("text")
            .attr("y", function(d, i) {
                return 10 + i*10;
//            return (legendSpace/2)+i*legendSpace  // space legend
        })
        .attr("x", width + (margin.right/2)+ 20 )
        .attr("class", "legend")    // style the legend
        .style("font-size","10px")  // Change the font size
        .style("font-weight", "bold") // Change the font to bold
        .style("text-anchor", "middle") // center the legend
        .style("fill", function(d) { // Add the colours dynamically
            return d.color = color(d.key); })
        .on("click", function(d){
            // Determine if current line is visible
            var active   = d.active ? false : true,
            newOpacity = active ? 0 : 1;
            // Hide or show the elements based on the ID
            d3.select("#tag"+d.key.replace(/\s+/g, ''))
                .transition().duration(100)
                .style("opacity", newOpacity);
            // Update whether or not the elements are active
            d.active = active;
            })
        .text(function(d) {
          return d.key;
        });
}